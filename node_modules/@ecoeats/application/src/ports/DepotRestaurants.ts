import { Restaurant } from "@ecoeats/domain";

export interface DepotRestaurants {
  sauvegarder(restaurant: Restaurant): Promise<void>;
  trouverParId(id: string): Promise<Restaurant>;
  listerTous(): Promise<Restaurant[]>;
  trouverParProprietaireId(proprietaireId: string): Promise<Restaurant | null>;
  rechercher(filtres: { latitude?: number; longitude?: number; rayonKm?: number; categorie?: string }): Promise<Restaurant[]>;
}
