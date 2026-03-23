import { Client } from "@ecoeats/domain";
import { ClientIntrouvableError } from "@ecoeats/domain";
import { DepotClients } from "@ecoeats/application";

export class DepotClientsEnMemoire implements DepotClients {
  private readonly store = new Map<string, Client>();

  async sauvegarder(client: Client): Promise<void> {
    this.store.set(client.id, client);
  }

  async trouverParId(id: string): Promise<Client | null> {
    return this.store.get(id) || null;
  }

  async mettreAJour(id: string, data: { nom?: string; email?: string; telephone?: string }): Promise<void> {
    const client = this.store.get(id);
    if (!client) return;
    this.store.set(id, new Client(
      client.id,
      data.nom || client.nom,
      data.email || client.email,
      client.adresse,
      data.telephone || client.telephone,
      client.getPointsFidelite()
    ));
  }
}
