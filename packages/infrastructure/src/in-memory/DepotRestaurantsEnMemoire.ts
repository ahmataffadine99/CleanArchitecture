import { Restaurant } from "@ecoeats/domain";
import { RestaurantIntrouvableError } from "@ecoeats/domain";
import { DepotRestaurants } from "@ecoeats/application";

export class DepotRestaurantsEnMemoire implements DepotRestaurants {
  private readonly store = new Map<string, Restaurant>();

  async sauvegarder(restaurant: Restaurant): Promise<void> {
    this.store.set(restaurant.id, restaurant);
  }

  async trouverParId(id: string): Promise<Restaurant> {
    const resto = this.store.get(id);
    if (!resto) throw new RestaurantIntrouvableError(id);
    return resto;
  }

  async listerTous(): Promise<Restaurant[]> {
    return [...this.store.values()];
  }

  async trouverParProprietaireId(proprietaireId: string): Promise<Restaurant | null> {
    return [...this.store.values()].find(r => r.proprietaireId === proprietaireId) || null;
  }
}
