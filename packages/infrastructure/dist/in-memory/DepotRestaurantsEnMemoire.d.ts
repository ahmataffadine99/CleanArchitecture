import { Restaurant } from "@ecoeats/domain";
import { DepotRestaurants } from "@ecoeats/application";
export declare class DepotRestaurantsEnMemoire implements DepotRestaurants {
    private readonly store;
    sauvegarder(restaurant: Restaurant): Promise<void>;
    trouverParId(id: string): Promise<Restaurant>;
    listerTous(): Promise<Restaurant[]>;
    trouverParProprietaireId(proprietaireId: string): Promise<Restaurant | null>;
}