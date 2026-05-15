import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotRestaurants } from "../../ports/DepotRestaurants";

export class ListerHistoriqueLivreurUseCase {
  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotRestaurants: DepotRestaurants
  ) {}

  async executer(livreurId: string): Promise<any[]> {
    const commandes = await this.depotCommandes.trouverParLivreur(livreurId);
    
    const commandesTerminees = commandes.filter(cmd => 
      cmd.getStatut() === 'LIVREE'
    );
    
    return Promise.all(commandesTerminees.map(async (cmd: Commande) => {
      let restaurantNom = "Restaurant";
      try {
        const r = await this.depotRestaurants.trouverParId(cmd.restaurantId);
        restaurantNom = r.nom;
      } catch (_) {}

      return {
        id: cmd.id,
        statut: cmd.getStatut(),
        creeLe: cmd.getCreeLe(),
        gainsCentimes: cmd.getFraisLivraison().enCentimes(),
        restaurantNom
      };
    }));
  }
}
