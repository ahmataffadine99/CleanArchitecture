import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";

export class ListerCommandesClientUseCase {
  constructor(private readonly depotCommandes: DepotCommandes) {}

  async executer(clientId: string): Promise<Commande[]> {
    return this.depotCommandes.trouverParClient(clientId);
  }
}
