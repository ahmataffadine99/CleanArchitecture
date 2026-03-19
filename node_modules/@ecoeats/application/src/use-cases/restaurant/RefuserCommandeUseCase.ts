import { Commande, StatutCommande } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";

export class RefuserCommandeUseCase {
  constructor(private readonly depotCommandes: DepotCommandes) {}

  async executer(commandeId: string): Promise<Commande> {
    const commande = await this.depotCommandes.trouverParId(commandeId);
    commande.changerStatut(StatutCommande.REFUSEE);
    await this.depotCommandes.sauvegarder(commande);
    return commande;
  }
}
