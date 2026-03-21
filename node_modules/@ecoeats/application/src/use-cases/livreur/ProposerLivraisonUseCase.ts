import { Commande, Livreur, StatutCommande } from "@ecoeats/domain";
import { SelectionLivreurService } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { DepotRestaurants } from "../../ports/DepotRestaurants";

type Req = {
  commandeId: string;
};

import { ServiceCartographie } from "../../ports/ServiceCartographie";

// Trouve les livreurs à proximité et leur envoie une proposition
export class ProposerLivraisonUseCase {
  private readonly RAYON_ACTION_KM = 5.0;

  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotLivreurs: DepotLivreurs,
    private readonly depotRestaurants: DepotRestaurants,
    private readonly cartographie: ServiceCartographie
  ) {}

  async executer(req: Req): Promise<Livreur> {
    const commande = await this.depotCommandes.trouverParId(req.commandeId);

    const statut = commande.getStatut();
    if (statut !== StatutCommande.PRETE && statut !== StatutCommande.EN_PREPARATION) {
      throw new Error(`La commande ${req.commandeId} n'est pas encore prête ou en préparation.`);
    }

    const restaurant = await this.depotRestaurants.trouverParId(commande.restaurantId);
    const livreursDisponibles = await this.depotLivreurs.listerDisponibles();

    // Filtrer les livreurs par proximité du restaurant
    const livreursProches = livreursDisponibles.filter(livreur => {
      const distance = this.cartographie.calculerDistanceKm(restaurant.position, livreur.position);
      return distance <= this.RAYON_ACTION_KM;
    });

    for (const livreur of livreursProches) {
      livreur.recevoirProposition(commande.id);
      await this.depotLivreurs.sauvegarder(livreur);
    }

    return livreursProches[0]; // Retourne le premier notifié (ou undefined si aucun)
  }
}
