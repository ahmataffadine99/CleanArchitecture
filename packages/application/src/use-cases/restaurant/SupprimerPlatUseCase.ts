import { DepotPlats } from "../../ports/DepotPlats";

export class SupprimerPlatUseCase {
  constructor(private readonly depotPlats: DepotPlats) {}

  async executer(platId: string): Promise<void> {
    await this.depotPlats.trouverParId(platId);
    await this.depotPlats.supprimer(platId);
  }
}
