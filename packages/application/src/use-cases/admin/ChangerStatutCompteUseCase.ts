import { DepotComptes } from "../../ports/DepotComptes";
import { CompteUtilisateur } from "@ecoeats/domain";

export class ChangerStatutCompteUseCase {
  constructor(private readonly depotComptes: DepotComptes) {}

  async executer(id: string, estActif: boolean): Promise<void> {
    const compte = await this.depotComptes.trouverParId(id);
    if (!compte) {
      throw new Error("Compte non trouvé.");
    }

    const nouveauCompte = new CompteUtilisateur(
      compte.id,
      compte.email,
      compte.motDePasseHache,
      compte.role,
      compte.profilId,
      estActif
    );

    await this.depotComptes.sauvegarder(nouveauCompte);
  }
}
