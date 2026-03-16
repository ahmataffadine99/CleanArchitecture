import { Commande, StatutCommande } from "@ecoeats/domain";
import { CalculPrixService } from "@ecoeats/domain";
import { Panier } from "@ecoeats/domain";
import { DepotCommandes } from "../ports/DepotCommandes";
import { DepotRestaurants } from "../ports/DepotRestaurants";
import { DepotClients } from "../ports/DepotClients";
import { DepotPlats } from "../ports/DepotPlats";
import { ServiceCartographie } from "../ports/ServiceCartographie";
import { v4 as uuid } from "uuid";

type Req = {
  clientId: string;
  panier: Panier;
  adresseLivraison: string;
};

export class PasserCommandeUseCase {
  private readonly calculPrix = new CalculPrixService();

  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotRestaurants: DepotRestaurants,
    private readonly depotClients: DepotClients,
    private readonly depotPlats: DepotPlats,
    private readonly cartographie: ServiceCartographie
  ) {}

  async executer(req: Req): Promise<Commande> {
    if (req.panier.estVide()) {
      throw new Error("Impossible de passer une commande avec un panier vide.");
    }

    const client = await this.depotClients.trouverParId(req.clientId);
    const restaurantId = req.panier.getRestaurantId()!;
    const restaurant = await this.depotRestaurants.trouverParId(restaurantId);

    // Simulation position client à partir de son adresse (coordonnées fixes pour la démo)
    const positionClient = { latitude: 48.8566, longitude: 2.3522 }; // Paris centre par défaut

    const distanceKm = this.cartographie.calculerDistanceKm(
      restaurant.position,
      positionClient as any
    );

    // Vérifier que les stocks sont toujours OK et les baisser
    for (const article of req.panier.getArticles()) {
      const plat = await this.depotPlats.trouverParId(article.menuItemId);
      plat.diminuerStock(article.quantite);
      await this.depotPlats.sauvegarder(plat);
    }

    const { prixPlats, fraisLivraison, fraisService } = this.calculPrix.calculerTotal(
      req.panier.getArticles(),
      distanceKm
    );

    const commande = new Commande(
      uuid(),
      req.clientId,
      restaurantId,
      [...req.panier.getArticles()],
      prixPlats,
      fraisLivraison,
      fraisService,
      req.adresseLivraison
    );

    await this.depotCommandes.sauvegarder(commande);
    req.panier.vider();

    return commande;
  }
}
