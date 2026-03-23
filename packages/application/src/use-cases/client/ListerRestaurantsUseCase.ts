import { Restaurant } from "@ecoeats/domain";
import { DepotRestaurants } from "../../ports/DepotRestaurants";

export class ListerRestaurantsUseCase {
  constructor(private readonly depotRestaurants: DepotRestaurants) {}

  async executer(filtres: { latitude?: number; longitude?: number; rayonKm?: number; categorie?: string } = {}): Promise<Restaurant[]> {
    if (filtres.latitude || filtres.longitude || filtres.categorie) {
      return this.depotRestaurants.rechercher(filtres);
    }
    return this.depotRestaurants.listerTous();
  }
}
