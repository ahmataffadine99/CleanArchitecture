import { PrismaClient } from "@prisma/client";
import { CompteUtilisateur } from "@ecoeats/domain";
import { DepotComptes } from "@ecoeats/application";
export declare class DepotComptesPrisma implements DepotComptes {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    sauvegarder(compte: CompteUtilisateur): Promise<void>;
    trouverParEmail(email: string): Promise<CompteUtilisateur | null>;
    trouverParId(id: string): Promise<CompteUtilisateur | null>;
}