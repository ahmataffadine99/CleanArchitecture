import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
import { CommandeIntrouvableError } from "@ecoeats/domain";

export class ObtenirCommandeUseCase {
  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotRestaurants: DepotRestaurants
  ) {}

  async executer(commandeId: string): Promise<any> {
    const commande = await this.depotCommandes.trouverParId(commandeId);
    if (!commande) throw new CommandeIntrouvableError(commandeId);

    let coordonneesRestaurant = { latitude: 48.8566, longitude: 2.3522 };
    try {
      const r = await this.depotRestaurants.trouverParId(commande.restaurantId);
      coordonneesRestaurant = { latitude: r.position.latitude, longitude: r.position.longitude };
    } catch (_) {}

    return {
      id: commande.id,
      restaurantId: commande.restaurantId,
      clientId: commande.clientId,
      statut: commande.getStatut(),
      prixTotal: commande.prixTotal().enEuros(),
      creeLe: commande.getCreeLe(),
      articles: commande.getArticles().map(a => ({
        nom: a.nom,
        quantite: a.quantite,
        prix: a.prixSnapshot.enEuros()
      })),
      adresseLivraison: commande.getAdresseLivraison(),
      clientPosition: {
        latitude: commande.getPositionLivraison().latitude,
        longitude: commande.getPositionLivraison().longitude
      },
      restaurantPosition: coordonneesRestaurant
    };
  }
}

