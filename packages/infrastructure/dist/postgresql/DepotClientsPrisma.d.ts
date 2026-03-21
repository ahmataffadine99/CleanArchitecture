import { PrismaClient } from "@prisma/client";
import { Client } from "@ecoeats/domain";
import { DepotClients } from "@ecoeats/application";
export declare class DepotClientsPrisma implements DepotClients {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    sauvegarder(client: Client): Promise<void>;
    trouverParId(id: string): Promise<Client>;
}
//# sourceMappingURL=DepotClientsPrisma.d.ts.map