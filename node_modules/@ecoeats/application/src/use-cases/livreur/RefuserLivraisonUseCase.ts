import { DepotLivreurs } from "../../ports/DepotLivreurs";

type Req = {
  livreurId: string;
  commandeId: string;
};

export class RefuserLivraisonUseCase {
  constructor(private readonly depotLivreurs: DepotLivreurs) {}

  async executer(req: Req): Promise<void> {
    const livreur = await this.depotLivreurs.trouverParId(req.livreurId);
    livreur.refuserProposition(req.commandeId);
    await this.depotLivreurs.sauvegarder(livreur);
  }
}
