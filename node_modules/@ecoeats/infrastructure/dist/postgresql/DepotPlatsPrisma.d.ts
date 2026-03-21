import { PrismaClient } from "@prisma/client";
import { PlatMenu } from "@ecoeats/domain";
import { DepotPlats } from "@ecoeats/application";
export declare class DepotPlatsPrisma implements DepotPlats {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    sauvegarder(plat: PlatMenu): Promise<void>;
    trouverParId(id: string): Promise<PlatMenu>;
    trouverParRestaurant(restaurantId: string): Promise<PlatMenu[]>;
    supprimer(id: string): Promise<void>;
}
//# sourceMappingURL=DepotPlatsPrisma.d.ts.map