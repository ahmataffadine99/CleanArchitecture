import { PrismaClient } from "@prisma/client";
import { Restaurant } from "@ecoeats/domain";
import { DepotRestaurants } from "@ecoeats/application";
export declare class DepotRestaurantsPrisma implements DepotRestaurants {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    sauvegarder(restaurant: Restaurant): Promise<void>;
    trouverParId(id: string): Promise<Restaurant>;
    listerTous(): Promise<Restaurant[]>;
    trouverParProprietaireId(proprietaireId: string): Promise<Restaurant | null>;
    private mapToEntity;
}