import { PrismaClient } from "@prisma/client";
import { Avis } from "@ecoeats/domain";
import { DepotAvis } from "@ecoeats/application";
export declare class DepotAvisPrisma implements DepotAvis {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    sauvegarder(avis: Avis): Promise<void>;
    trouverParLivreur(livreurId: string): Promise<Avis[]>;
    trouverParCommande(commandeId: string): Promise<Avis | null>;
}