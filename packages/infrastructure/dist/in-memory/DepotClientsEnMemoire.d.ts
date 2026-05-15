import { Client } from "@ecoeats/domain";
import { DepotClients } from "@ecoeats/application";
export declare class DepotClientsEnMemoire implements DepotClients {
    private readonly store;
    sauvegarder(client: Client): Promise<void>;
    trouverParId(id: string): Promise<Client>;
}