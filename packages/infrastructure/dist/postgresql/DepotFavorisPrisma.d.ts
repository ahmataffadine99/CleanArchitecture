import { PrismaClient } from "@prisma/client";
import { DepotFavoris } from "@ecoeats/application";
export declare class DepotFavorisPrisma implements DepotFavoris {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    ajouterRestaurant(clientId: string, restaurantId: string): Promise<void>;
    retirerRestaurant(clientId: string, restaurantId: string): Promise<void>;
    listerRestaurants(clientId: string): Promise<string[]>;
    ajouterPlat(clientId: string, platId: string): Promise<void>;
    retirerPlat(clientId: string, platId: string): Promise<void>;
    listerPlats(clientId: string): Promise<string[]>;
}