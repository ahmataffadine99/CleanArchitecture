import { DepotFavoris } from "../../ports/DepotFavoris";
export declare class GererFavorisUseCase {
    private readonly depotFavoris;
    constructor(depotFavoris: DepotFavoris);
    ajouterRestaurant(clientId: string, restaurantId: string): Promise<void>;
    retirerRestaurant(clientId: string, restaurantId: string): Promise<void>;
    listerRestaurants(clientId: string): Promise<string[]>;
    ajouterPlat(clientId: string, platId: string): Promise<void>;
    retirerPlat(clientId: string, platId: string): Promise<void>;
    listerPlats(clientId: string): Promise<string[]>;
}