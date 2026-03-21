import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
import { DepotLivreurs } from "../../ports/DepotLivreurs";

export class ListerCommandesClientUseCase {
  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotRestaurants: DepotRestaurants,
    private readonly depotLivreurs: DepotLivreurs
  ) {}

  async executer(clientId: string): Promise<any[]> {
    const commandes = await this.depotCommandes.trouverParClient(clientId);
    
    return Promise.all(commandes.map(async (cmd: Commande) => {
      let restaurantNom = "Restaurant";
      try {
        const r = await this.depotRestaurants.trouverParId(cmd.restaurantId);
        restaurantNom = r.nom;
      } catch (_) {}

      let livreurNom = undefined;
      if (cmd.getLivreurId()) {
        try {
          const l = await this.depotLivreurs.trouverParId(cmd.getLivreurId()!);
          livreurNom = l.nom;
        } catch (_) {}
      }

      return {
        ...cmd,
        id: cmd.id,
        statut: cmd.getStatut(),
        prixTotal: cmd.prixTotal().enEuros(),
        creeLe: cmd.getCreeLe(),
        restaurantNom,
        livreurNom,
        adresseLivraison: cmd.getAdresseLivraison()
      };
    }));
  }
}
