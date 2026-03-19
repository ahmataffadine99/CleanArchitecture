import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { ProposerLivraisonUseCase } from "../livreur/ProposerLivraisonUseCase";

export class MarquerCommandePreteUseCase {
  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly proposerLivraison: ProposerLivraisonUseCase
  ) {}

  async executer(commandeId: string): Promise<Commande> {
    const commande = await this.depotCommandes.trouverParId(commandeId);
    commande.marquerPrete();
    await this.depotCommandes.sauvegarder(commande);
    
    // Tenter de trouver un livreur immédiatement
    try {
      await this.proposerLivraison.executer({ commandeId });
    } catch (err) {
      console.warn("Aucun livreur disponible pour le moment:", err);
    }

    return commande;
  }
}
