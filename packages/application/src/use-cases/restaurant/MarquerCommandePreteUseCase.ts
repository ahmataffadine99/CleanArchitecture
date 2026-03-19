import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";

export class MarquerCommandePreteUseCase {
  constructor(private readonly depotCommandes: DepotCommandes) {}

  async executer(commandeId: string): Promise<Commande> {
    const commande = await this.depotCommandes.trouverParId(commandeId);
    commande.marquerPrete();
    await this.depotCommandes.sauvegarder(commande);
    return commande;
  }
}
