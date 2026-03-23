import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotClients } from "../../ports/DepotClients";
import { DepotRestaurants } from "../../ports/DepotRestaurants";

export class ListerToutesLesCommandesUseCase {
  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotClients: DepotClients,
    private readonly depotRestaurants: DepotRestaurants
  ) {}

  async executer(): Promise<any[]> {
    const commandes = await this.depotCommandes.trouverTout();
    
    // Pour des raisons de performance, on pourrait faire des requêtes groupées
    // Mais pour l'admin avec peu de commandes, c'est acceptable ici
    const resultats = [];
    for (const c of commandes) {
      const client = await this.depotClients.trouverParId(c.clientId);
      const resto = await this.depotRestaurants.trouverParId(c.restaurantId);
      
      resultats.push({
        id: c.id,
        clientId: c.clientId,
        clientNom: client?.nom || "Client inconnu",
        restaurantId: c.restaurantId,
        restaurantNom: resto?.nom || "Restaurant inconnu",
        statut: c.getStatut(),
        prixTotal: c.prixTotal().enEuros(),
        adresseLivraison: c.getAdresseLivraison(),
        creeLe: c.getCreeLe()
      });
    }
    
    return resultats;
  }
}
