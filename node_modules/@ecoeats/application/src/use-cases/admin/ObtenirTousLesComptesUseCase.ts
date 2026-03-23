import { CompteUtilisateur } from "@ecoeats/domain";
import { DepotComptes } from "../../ports/DepotComptes";

export class ObtenirTousLesComptesUseCase {
  constructor(private readonly depotComptes: DepotComptes) {}

  async executer(): Promise<CompteUtilisateur[]> {
    return this.depotComptes.trouverTout();
  }
}
