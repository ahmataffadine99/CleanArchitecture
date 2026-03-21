import { Avis } from "@ecoeats/domain";
import { DepotAvis } from "../../ports/DepotAvis";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { v4 as uuid } from "uuid";

export class LaisserAvisLivreurUseCase {
  constructor(
    private readonly depotAvis: DepotAvis,
    private readonly depotCommandes: DepotCommandes
  ) {}

  async executer(params: {
    commandeId: string;
    note: number;
    commentaire?: string;
  }): Promise<void> {
    const commande = await this.depotCommandes.trouverParId(params.commandeId);
    if (!commande) throw new Error("Commande introuvable");
    const livreurId = commande.getLivreurId();
    if (!livreurId) throw new Error("Cette commande n'a pas de livreur associé");
    if (commande.getStatut() !== "LIVREE") throw new Error("Vous ne pouvez noter qu'une commande livrée");

    const avis = new Avis(
      uuid(),
      params.commandeId,
      livreurId,
      commande.clientId,
      params.note,
      params.commentaire || null
    );

    await this.depotAvis.sauvegarder(avis);
  }
}
