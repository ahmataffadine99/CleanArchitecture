import { Commande, Restaurant } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { DepotRestaurants } from "../../ports/DepotRestaurants";

export type PropositionDetaillee = {
  commandeId: string;
  restaurantNom: string;
  restaurantAdresse: string;
  clientAdresse: string;
  tempsPreparationEstime?: number;
  montantLivraison: number;
};

export class ObtenirPropositionsLivreurUseCase {
  constructor(
    private readonly depotLivreurs: DepotLivreurs,
    private readonly depotCommandes: DepotCommandes,
    private readonly depotRestaurants: DepotRestaurants
  ) {}

  async executer(livreurId: string): Promise<PropositionDetaillee[]> {
    const livreur = await this.depotLivreurs.trouverParId(livreurId);
    const details: PropositionDetaillee[] = [];

    for (const commandeId of livreur.getPropositionsIds()) {
      try {
        const commande = await this.depotCommandes.trouverParId(commandeId);
        const restaurant = await this.depotRestaurants.trouverParId(commande.restaurantId);

        details.push({
          commandeId: commande.id,
          restaurantNom: restaurant.nom,
          restaurantAdresse: restaurant.adresse,
          clientAdresse: commande.getAdresseLivraison(),
          tempsPreparationEstime: commande.getTempsPreparation() || undefined,
          montantLivraison: commande.getFraisLivraison().enEuros()
        });
      } catch (err) {
        console.error(`Erreur lors de la récupération de la proposition ${commandeId}:`, err);
      }
    }

    return details;
  }
}
