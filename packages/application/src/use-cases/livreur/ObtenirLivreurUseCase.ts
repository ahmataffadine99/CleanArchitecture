import { Livreur } from "@ecoeats/domain";
import { DepotLivreurs } from "../../ports/DepotLivreurs";

export class ObtenirLivreurUseCase {
  constructor(private readonly depotLivreurs: DepotLivreurs) {}

  async executer(livreurId: string): Promise<Livreur> {
    return this.depotLivreurs.trouverParId(livreurId);
  }
}
