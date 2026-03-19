import { Restaurant } from "@ecoeats/domain";
import { DepotRestaurants } from "../../ports/DepotRestaurants";

export class ObtenirMonRestaurantUseCase {
  constructor(private readonly depotRestaurants: DepotRestaurants) {}

  async executer(proprietaireId: string): Promise<Restaurant | null> {
    return this.depotRestaurants.trouverParProprietaireId(proprietaireId);
  }
}

