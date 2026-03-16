import { Client } from "@ecoeats/domain";
import { ClientIntrouvableError } from "@ecoeats/domain";
import { DepotClients } from "@ecoeats/application";

export class DepotClientsEnMemoire implements DepotClients {
  private readonly store = new Map<string, Client>();

  async sauvegarder(client: Client): Promise<void> {
    this.store.set(client.id, client);
  }

  async trouverParId(id: string): Promise<Client> {
    const client = this.store.get(id);
    if (!client) throw new ClientIntrouvableError(id);
    return client;
  }
}
