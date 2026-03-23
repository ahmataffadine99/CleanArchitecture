import { DepotFavoris } from "../../ports/DepotFavoris";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
import { DepotPlats } from "../../ports/DepotPlats";
import { Restaurant, PlatMenu } from "@ecoeats/domain";

export class ObtenirFavorisDetailsUseCase {
  constructor(
    private readonly depotFavoris: DepotFavoris,
    private readonly depotRestaurants: DepotRestaurants,
    private readonly depotPlats: DepotPlats
  ) {}

  async executer(clientId: string): Promise<{ restaurants: Restaurant[], plats: PlatMenu[] }> {
    const [idRestos, idPlats] = await Promise.all([
      this.depotFavoris.listerRestaurants(clientId),
      this.depotFavoris.listerPlats(clientId)
    ]);

    const [restos, plats] = await Promise.all([
      Promise.all(idRestos.map(id => this.depotRestaurants.trouverParId(id).catch(() => null))),
      Promise.all(idPlats.map(id => this.depotPlats.trouverParId(id).catch(() => null)))
    ]);

    return {
      restaurants: restos.filter(r => r !== null) as Restaurant[],
      plats: plats.filter(p => p !== null) as PlatMenu[]
    };
  }
}
