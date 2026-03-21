import { DepotFavoris } from "../../ports/DepotFavoris";

export class GererFavorisUseCase {
  constructor(private readonly depotFavoris: DepotFavoris) {}

  async ajouterRestaurant(clientId: string, restaurantId: string): Promise<void> {
    await this.depotFavoris.ajouterRestaurant(clientId, restaurantId);
  }

  async retirerRestaurant(clientId: string, restaurantId: string): Promise<void> {
    await this.depotFavoris.retirerRestaurant(clientId, restaurantId);
  }

  async listerRestaurants(clientId: string): Promise<string[]> {
    return this.depotFavoris.listerRestaurants(clientId);
  }

  async ajouterPlat(clientId: string, platId: string): Promise<void> {
    await this.depotFavoris.ajouterPlat(clientId, platId);
  }

  async retirerPlat(clientId: string, platId: string): Promise<void> {
    await this.depotFavoris.retirerPlat(clientId, platId);
  }

  async listerPlats(clientId: string): Promise<string[]> {
    return this.depotFavoris.listerPlats(clientId);
  }
}
