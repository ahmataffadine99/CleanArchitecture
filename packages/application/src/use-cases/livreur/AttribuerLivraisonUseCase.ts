import { Commande, Livreur, StatutCommande } from "@ecoeats/domain";
import { SelectionLivreurService } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { DepotRestaurants } from "../../ports/DepotRestaurants";

type Req = {
  commandeId: string;
};

type Resultat = {
  commande: Commande;
  livreur: Livreur;
};

export class AttribuerLivraisonUseCase {
  private readonly selectionLivreur = new SelectionLivreurService();

  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotLivreurs: DepotLivreurs,
    private readonly depotRestaurants: DepotRestaurants
  ) {}

  async executer(req: Req): Promise<Resultat> {
    const commande = await this.depotCommandes.trouverParId(req.commandeId);

    if (commande.getStatut() !== StatutCommande.PRETE) {
      throw new Error(`La commande ${req.commandeId} n'est pas encore prête pour la collecte.`);
    }

    const restaurant = await this.depotRestaurants.trouverParId(commande.restaurantId);
    const livreurs = await this.depotLivreurs.listerDisponibles();

    const livreurChoisi = this.selectionLivreur.trouverLePlusProche(
      livreurs,
      restaurant.position,
      restaurant.id
    );

    if (!livreurChoisi) {
      throw new Error("Aucun livreur disponible pour le moment à proximité du restaurant.");
    }

    livreurChoisi.prendreEnCharge(commande.id, restaurant.id);
    commande.assignerLivreur(livreurChoisi.id);

    await this.depotLivreurs.sauvegarder(livreurChoisi);
    await this.depotCommandes.sauvegarder(commande);

    return { commande, livreur: livreurChoisi };
  }
}
