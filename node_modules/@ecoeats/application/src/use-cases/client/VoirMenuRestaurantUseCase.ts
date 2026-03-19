import { PlatMenu } from "@ecoeats/domain";
import { DepotPlats } from "../../ports/DepotPlats";

type Resultat = {
  disponibles: PlatMenu[];
  rupture: PlatMenu[];
};

export class VoirMenuRestaurantUseCase {
  constructor(private readonly depotPlats: DepotPlats) {}

  async executer(restaurantId: string): Promise<Resultat> {
    const plats = await this.depotPlats.trouverParRestaurant(restaurantId);
    return {
      disponibles: plats.filter(p => p.estDisponible()),
      rupture: plats.filter(p => !p.estDisponible()),
    };
  }
}
