import { Commande, Livreur, Money, CalculGainsLivreurService } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { ServiceCartographie } from "../../ports/ServiceCartographie";
import { DepotRestaurants } from "../../ports/DepotRestaurants";

type Req = {
  commandeId: string;
  livreurId: string;
  pourboire?: number; // en euros
};

export class TerminerLivraisonUseCase {
  private readonly calculGains = new CalculGainsLivreurService();

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
    // On utilise Paris centre par défaut pour la démo si non spécifié
    const positionClient = { latitude: 48.8566, longitude: 2.3522 };
    const distanceKm = this.cartographie.calculerDistanceKm(
      restaurant.position,
      positionClient as any
    );

    const gains = this.calculGains.calculerGains(
      distanceKm,
      req.pourboire ? Money.fromEuros(req.pourboire) : Money.zero()
    );

    commande.marquerLivree();
    livreur.terminerLivraison(commande.id, gains);

    await this.depotCommandes.sauvegarder(commande);
    await this.depotLivreurs.sauvegarder(livreur);

    return { livreur, gains };
  }
}
