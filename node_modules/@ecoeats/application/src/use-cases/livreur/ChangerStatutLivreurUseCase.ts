import { Livreur } from "@ecoeats/domain";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { DepotCommandes } from "../../ports/DepotCommandes";

type Req = {
  livreurId: string;
  statut: "DISPONIBLE" | "INDISPONIBLE";
};

export class ChangerStatutLivreurUseCase {
  constructor(
    private readonly depotLivreurs: DepotLivreurs,
    private readonly depotCommandes: DepotCommandes
  ) {}

  async executer(req: Req): Promise<Livreur> {
    const livreur = await this.depotLivreurs.trouverParId(req.livreurId);

    if (req.statut === "DISPONIBLE") {
      livreur.seDeclarerDisponible();
      
      // Assigner les propositions en attente
      const commandesSansLivreur = await this.depotCommandes.trouverCommandesSansLivreur();
      for (const cmd of commandesSansLivreur) {
        livreur.recevoirProposition(cmd.id);
      }
    } else {
      livreur.seDeclarerIndisponible();
    }

    await this.depotLivreurs.sauvegarder(livreur);
    return livreur;
  }
}
