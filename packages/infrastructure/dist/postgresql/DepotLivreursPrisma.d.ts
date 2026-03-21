import { PrismaClient } from "@prisma/client";
import { Livreur } from "@ecoeats/domain";
import { DepotLivreurs } from "@ecoeats/application";
export declare class DepotLivreursPrisma implements DepotLivreurs {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    sauvegarder(livreur: Livreur): Promise<void>;
    trouverParId(id: string): Promise<Livreur>;
    listerDisponibles(): Promise<Livreur[]>;
    listerEligiblesPourRestaurant(restaurantId: string): Promise<Livreur[]>;
    retirerPropositionDeTous(commandeId: string): Promise<void>;
    private reconstruire;
}
//# sourceMappingURL=DepotLivreursPrisma.d.ts.map