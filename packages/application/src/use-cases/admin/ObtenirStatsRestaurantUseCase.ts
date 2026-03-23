import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotRestaurants } from "../../ports/DepotRestaurants";

export class ObtenirStatsRestaurantUseCase {
  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotRestaurants: DepotRestaurants
  ) {}

  async executer(restaurantId: string) {
    const [commandes, restaurant] = await Promise.all([
      this.depotCommandes.trouverParRestaurant(restaurantId),
      this.depotRestaurants.trouverParId(restaurantId)
    ]);

    if (!restaurant) throw new Error("Restaurant introuvable");

    const ventesTotalesCentimes = commandes
      .filter(c => c.getStatut() === "LIVREE")
      .reduce((acc, c) => acc + c.prixTotal().enCentimes(), 0);

    // Simulation d'une note si pas encore implémenté dans le domain
    const noteMoyenne = 4.5 + Math.random() * 0.5; 

    return {
      id: restaurant.id,
      nom: restaurant.nom,
      adresse: restaurant.adresse,
      imageUrl: restaurant.imageUrl,
      ventesTotalesEuros: ventesTotalesCentimes / 100,
      nbCommandes: commandes.length,
      noteMoyenne: parseFloat(noteMoyenne.toFixed(1))
    };
  }
}
