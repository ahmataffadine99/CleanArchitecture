import { CompteUtilisateur } from "@ecoeats/domain";
import { DepotComptes } from "@ecoeats/application";

export class DepotComptesEnMemoire implements DepotComptes {
  private readonly store = new Map<string, CompteUtilisateur>();

  async sauvegarder(compte: CompteUtilisateur): Promise<void> {
    this.store.set(compte.email, compte);
  }

  async trouverParEmail(email: string): Promise<CompteUtilisateur | null> {
    return this.store.get(email) ?? null;
  }

  async trouverParId(id: string): Promise<CompteUtilisateur | null> {
    for (const compte of this.store.values()) {
      if (compte.id === id) return compte;
    }
    return null;
  }

  async trouverTout(): Promise<CompteUtilisateur[]> {
    return Array.from(this.store.values());
  }
}
