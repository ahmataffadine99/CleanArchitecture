import { Restaurant } from "@ecoeats/domain";
import { DepotRestaurants } from "../../ports/DepotRestaurants";

export class ListerRestaurantsUseCase {
  constructor(private readonly depotRestaurants: DepotRestaurants) {}

  async executer(): Promise<Restaurant[]> {
    return this.depotRestaurants.listerTous();
  }
}
