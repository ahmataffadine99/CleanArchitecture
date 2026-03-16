import { Commande, Livreur, Money } from "@ecoeats/domain";
import { DepotCommandes } from "../ports/DepotCommandes";
import { DepotLivreurs } from "../ports/DepotLivreurs";
import { ServiceCartographie } from "../ports/ServiceCartographie";
import { DepotRestaurants } from "../ports/DepotRestaurants";

// Formule de rémunération livreur : 2€ prise en charge + 1€/km + pourboire 100%
// La plateforme ne prend aucune commission sur la part livreur
const PRISE_EN_CHARGE_EUROS = 2;
const TARIF_KM_LIVREUR = 1;

type Req = {
  commandeId: string;
  livreurId: string;
  pourboire?: number; // en euros
};

export class TerminerLivraisonUseCase {
  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotLivreurs: DepotLivreurs,
    private readonly depotRestaurants: DepotRestaurants,
    private readonly cartographie: ServiceCartographie
  ) {}

  async executer(req: Req): Promise<{ livreur: Livreur; gains: Money }> {
    const commande = await this.depotCommandes.trouverParId(req.commandeId);
    const livreur = await this.depotLivreurs.trouverParId(req.livreurId);
    const restaurant = await this.depotRestaurants.trouverParId(commande.restaurantId);

    // Calcul distance restaurant → client (simulation)
    const positionClient = { latitude: 48.8566, longitude: 2.3522 };
    const distanceKm = this.cartographie.calculerDistanceKm(
      restaurant.position,
      positionClient as any
    );

    const gains = Money.fromEuros(
      PRISE_EN_CHARGE_EUROS +
      distanceKm * TARIF_KM_LIVREUR +
      (req.pourboire ?? 0)
    );

    commande.marquerLivree();
    livreur.terminerLivraison(gains);

    await this.depotCommandes.sauvegarder(commande);
    await this.depotLivreurs.sauvegarder(livreur);

    return { livreur, gains };
  }
}
