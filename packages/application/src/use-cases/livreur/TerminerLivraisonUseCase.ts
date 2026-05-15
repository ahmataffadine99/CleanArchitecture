import { Commande, Livreur, Money, CalculGainsLivreurService } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { ServiceCartographie } from "../../ports/ServiceCartographie";
import { DepotRestaurants } from "../../ports/DepotRestaurants";

type Req = {
  commandeId: string;
  livreurId: string;
  pourboire?: number;
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
    if (!commande) throw new Error("Commande introuvable");

    const livreur = await this.depotLivreurs.trouverParId(req.livreurId);
    if (!livreur) throw new Error("Livreur introuvable");

    const restaurant = await this.depotRestaurants.trouverParId(commande.restaurantId);
    if (!restaurant) throw new Error("Restaurant introuvable");

    const distanceKm = this.cartographie.calculerDistanceKm(
      restaurant.position,
      commande.getPositionLivraison()
    );

    const distancePourGains = Math.min(distanceKm, 50.0);

    const gains = this.calculGains.calculerGains(
      distancePourGains,
      req.pourboire ? Money.fromEuros(req.pourboire) : Money.zero()
    );

    commande.marquerLivree();
    livreur.terminerLivraison(commande.id, gains);

    try {
      const historique = await this.depotCommandes.trouverParLivreur(livreur.id);
      const nbLivrees = historique.filter(c => c.getStatut() === 'LIVREE').length;
      if (nbLivrees >= 5) {
        livreur.estExpert = true;
      }
    } catch (_) {}

    await this.depotCommandes.sauvegarder(commande);
    await this.depotLivreurs.sauvegarder(livreur);

    return { livreur, gains };
  }
}
