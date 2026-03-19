import { Coordonnees } from "@ecoeats/domain";
import { DepotRestaurants } from "../../ports/DepotRestaurants";

type Req = {
  restaurantId: string;
  nom?: string;
  adresse?: string;
  imageUrl?: string | null;
  latitude?: number;
  longitude?: number;
};

export class ModifierRestaurantUseCase {
  constructor(private readonly depotRestaurants: DepotRestaurants) {}

  async executer(req: Req): Promise<void> {
    const restaurant = await this.depotRestaurants.trouverParId(req.restaurantId);

    if (req.nom !== undefined) restaurant.nom = req.nom;
    if (req.adresse !== undefined) restaurant.adresse = req.adresse;
    if (req.imageUrl !== undefined) restaurant.imageUrl = req.imageUrl;
    
    if (req.latitude !== undefined && req.longitude !== undefined) {
      restaurant.position = new Coordonnees(req.latitude, req.longitude);
    }

    await this.depotRestaurants.sauvegarder(restaurant);
  }
}
