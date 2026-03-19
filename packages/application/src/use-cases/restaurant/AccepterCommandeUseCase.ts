import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { ProposerLivraisonUseCase } from "../livreur/ProposerLivraisonUseCase";

type Req = {
  commandeId: string;
  tempsPreparationMinutes: number;
};

export class AccepterCommandeUseCase {
  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly proposerLivraison: ProposerLivraisonUseCase
  ) {}

  async executer(req: Req): Promise<Commande> {
    const commande = await this.depotCommandes.trouverParId(req.commandeId);

    commande.accepter(req.tempsPreparationMinutes);
    await this.depotCommandes.sauvegarder(commande);

    // Tenter de trouver un livreur dès la préparation
    try {
      await this.proposerLivraison.executer({ commandeId: req.commandeId });
    } catch (err) {
      console.warn("Aucun livreur disponible pour le moment:", err);
    }

    return commande;
  }
}
