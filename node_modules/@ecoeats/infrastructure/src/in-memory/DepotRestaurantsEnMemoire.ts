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

  async rechercher(filtres: { latitude?: number; longitude?: number; rayonKm?: number; categorie?: string }): Promise<Restaurant[]> {
    let list = [...this.store.values()];

    if (filtres.categorie && filtres.categorie !== 'all') {
      list = list.filter(r => r.categories.includes(filtres.categorie!));
    }

    if (filtres.latitude !== undefined && filtres.longitude !== undefined && filtres.rayonKm !== undefined) {
      list = list.filter(r => {
        const dist = this.calculerDistance(filtres.latitude!, filtres.longitude!, r.position.latitude, r.position.longitude);
        return dist <= filtres.rayonKm!;
      });
    }

    return list;
  }

  private calculerDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
