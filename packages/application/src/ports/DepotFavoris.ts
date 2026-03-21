export interface DepotFavoris {
  ajouterRestaurant(clientId: string, restaurantId: string): Promise<void>;
  retirerRestaurant(clientId: string, restaurantId: string): Promise<void>;
  listerRestaurants(clientId: string): Promise<string[]>; // Retourne les IDs
  
  ajouterPlat(clientId: string, platId: string): Promise<void>;
  retirerPlat(clientId: string, platId: string): Promise<void>;
  listerPlats(clientId: string): Promise<string[]>;
}
