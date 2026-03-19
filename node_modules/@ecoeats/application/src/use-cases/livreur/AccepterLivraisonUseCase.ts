import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotLivreurs } from "../../ports/DepotLivreurs";

type Req = {
  livreurId: string;
  commandeId: string;
};

export class AccepterLivraisonUseCase {
  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotLivreurs: DepotLivreurs
  ) {}

  async executer(req: Req): Promise<void> {
    const livreur = await this.depotLivreurs.trouverParId(req.livreurId);
    const commande = await this.depotCommandes.trouverParId(req.commandeId);

    livreur.accepterProposition(req.commandeId);
    commande.assignerLivreur(livreur.id);

    await this.depotLivreurs.sauvegarder(livreur);
    await this.depotCommandes.sauvegarder(commande);

    // Nettoyer les propositions chez tous les autres livreurs
    await this.depotLivreurs.retirerPropositionDeTous(req.commandeId);
  }
}
