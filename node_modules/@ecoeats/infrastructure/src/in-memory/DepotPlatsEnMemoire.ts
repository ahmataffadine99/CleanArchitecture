import { PlatMenu } from "@ecoeats/domain";
import { PlatIntrouvableError } from "@ecoeats/domain";
import { DepotPlats } from "@ecoeats/application";

export class DepotPlatsEnMemoire implements DepotPlats {
  private readonly store = new Map<string, PlatMenu>();

  async sauvegarder(plat: PlatMenu): Promise<void> {
    this.store.set(plat.id, plat);
  }

  async trouverParId(id: string): Promise<PlatMenu> {
    const plat = this.store.get(id);
    if (!plat) throw new PlatIntrouvableError(id);
    return plat;
  }

  async trouverParRestaurant(restaurantId: string): Promise<PlatMenu[]> {
    return [...this.store.values()].filter(p => p.restaurantId === restaurantId);
  }

  async supprimer(id: string): Promise<void> {
    this.store.delete(id);
  }
}
