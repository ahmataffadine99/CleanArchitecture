import { Restaurant } from "@ecoeats/domain";

export interface DepotRestaurants {
  sauvegarder(restaurant: Restaurant): Promise<void>;
  trouverParId(id: string): Promise<Restaurant>;
  listerTous(): Promise<Restaurant[]>;
}
