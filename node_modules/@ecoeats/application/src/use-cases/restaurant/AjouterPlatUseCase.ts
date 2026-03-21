import { PlatMenu, Money } from "@ecoeats/domain";
import { DepotPlats } from "../../ports/DepotPlats";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
import { v4 as uuid } from "uuid";

type Req = {
  restaurantId: string;
  nom: string;
  description: string;
  prixEuros: number;
  allergenes: string[];
  stockJournalier: number;
  imageUrl?: string;
  actif?: boolean;
  categorie?: string;
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
      req.prixEuros ? Money.fromEuros(req.prixEuros) : Money.zero(),
      req.allergenes || [],
      req.stockJournalier || 0,
      req.restaurantId,
      req.imageUrl,
      req.actif ?? true,
      req.categorie ?? "PLAT"
    );

    await this.depotPlats.sauvegarder(plat);
    return plat;
  }
}
