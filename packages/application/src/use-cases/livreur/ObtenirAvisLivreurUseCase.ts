import { Avis } from "@ecoeats/domain";
import { DepotAvis } from "../../ports/DepotAvis";

export class ObtenirAvisLivreurUseCase {
  constructor(private readonly depotAvis: DepotAvis) {}

  async executer(livreurId: string): Promise<Avis[]> {
    return this.depotAvis.trouverParLivreur(livreurId);
  }
}
