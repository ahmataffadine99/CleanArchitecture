import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";

export class ListerCommandesRestaurantUseCase {
  constructor(private readonly depotCommandes: DepotCommandes) {}

  async executer(restaurantId: string): Promise<Commande[]> {
    if (restaurantId === "all") {
      // Pour une démo multi-resto sans login
      return this.depotCommandes.trouverTout(); 
    }
    return this.depotCommandes.trouverParRestaurant(restaurantId);
  }
}
