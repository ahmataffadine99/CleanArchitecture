import { Commande, Livreur, StatutCommande } from "@ecoeats/domain";
import { SelectionLivreurService } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { DepotRestaurants } from "../../ports/DepotRestaurants";

type Req = {
  commandeId: string;
};

// Trouve le livreur le plus proche et lui envoie une proposition
export class ProposerLivraisonUseCase {
  private readonly selectionLivreur = new SelectionLivreurService();

  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotLivreurs: DepotLivreurs,
    private readonly depotRestaurants: DepotRestaurants
  ) {}

  async executer(req: Req): Promise<Livreur> {
    const commande = await this.depotCommandes.trouverParId(req.commandeId);

    const statut = commande.getStatut();
    if (statut !== StatutCommande.PRETE && statut !== StatutCommande.EN_PREPARATION) {
      throw new Error(`La commande ${req.commandeId} n'est pas encore prête ou en préparation.`);
    }

    const restaurant = await this.depotRestaurants.trouverParId(commande.restaurantId);
    const livreurs = await this.depotLivreurs.listerDisponibles();

    for (const livreur of livreurs) {
      livreur.recevoirProposition(commande.id);
      await this.depotLivreurs.sauvegarder(livreur);
    }

    return livreurs[0]; // On retourne le premier par défaut si besoin, ou on change le retour
  }
}
