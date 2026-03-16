import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../ports/DepotCommandes";

type Req = {
  commandeId: string;
  tempsPreparationMinutes: number;
};

export class AccepterCommandeUseCase {
  constructor(private readonly depotCommandes: DepotCommandes) {}

  async executer(req: Req): Promise<Commande> {
    const commande = await this.depotCommandes.trouverParId(req.commandeId);

    commande.accepter(req.tempsPreparationMinutes);
    await this.depotCommandes.sauvegarder(commande);

    return commande;
  }
}
