import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { CommandeIntrouvableError } from "@ecoeats/domain";

type Req = {
  livreurId: string;
  commandeId: string;
};

export class RecupererCommandeUseCase {
  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotLivreurs: DepotLivreurs
  ) {}

  async executer(req: Req): Promise<void> {
    const commande = await this.depotCommandes.trouverParId(req.commandeId);
    if (!commande) throw new CommandeIntrouvableError(req.commandeId);

    if (commande.getLivreurId() !== req.livreurId) {
      throw new Error("Ce livreur n'est pas assigné à cette commande.");
    }

    commande.recuperer();

    await this.depotCommandes.sauvegarder(commande);
  }
}
