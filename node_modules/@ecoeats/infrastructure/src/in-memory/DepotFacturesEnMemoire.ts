import { Facture } from "@ecoeats/domain";
import { DepotFactures } from "@ecoeats/application";

export class DepotFacturesEnMemoire implements DepotFactures {
  private readonly store = new Map<string, Facture>();

  async sauvegarder(facture: Facture): Promise<void> {
    this.store.set(facture.commandeId, facture);
  }

  async trouverParCommande(commandeId: string): Promise<Facture | null> {
    return this.store.get(commandeId) ?? null;
  }
}
