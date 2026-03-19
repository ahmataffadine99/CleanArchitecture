import { Livreur, StatutLivreur } from "@ecoeats/domain";
import { DepotLivreurs } from "../../ports/DepotLivreurs";

type Req = {
  livreurId: string;
  statut: "DISPONIBLE" | "INDISPONIBLE";
};

export class ChangerStatutLivreurUseCase {
  constructor(private readonly depotLivreurs: DepotLivreurs) {}

  async executer(req: Req): Promise<Livreur> {
    const livreur = await this.depotLivreurs.trouverParId(req.livreurId);

    if (req.statut === "DISPONIBLE") {
      livreur.seDeclarerDisponible();
    } else {
      livreur.seDeclarerIndisponible();
    }

    await this.depotLivreurs.sauvegarder(livreur);
    return livreur;
  }
}
