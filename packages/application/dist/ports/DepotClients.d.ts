import { Client } from "@ecoeats/domain";
export interface DepotClients {
    sauvegarder(client: Client): Promise<void>;
    trouverParId(id: string): Promise<Client>;
}