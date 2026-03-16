import { PlatMenu, Money } from "@ecoeats/domain";
import { DepotPlats } from "../ports/DepotPlats";
import { DepotRestaurants } from "../ports/DepotRestaurants";
import { v4 as uuid } from "uuid";

type Req = {
  restaurantId: string;
  nom: string;
  description: string;
  prixEuros: number;
  allergenes: string[];
  stockJournalier: number;
};

export class AjouterPlatUseCase {
  constructor(
    private readonly depotPlats: DepotPlats,
    private readonly depotRestaurants: DepotRestaurants
  ) {}

  async executer(req: Req): Promise<PlatMenu> {
    await this.depotRestaurants.trouverParId(req.restaurantId); // vérifie que le resto existe

    const plat = new PlatMenu(
      uuid(),
      req.nom,
      req.description,
      Money.fromEuros(req.prixEuros),
      req.allergenes,
      req.stockJournalier,
      req.restaurantId
    );

    await this.depotPlats.sauvegarder(plat);
    return plat;
  }
}
