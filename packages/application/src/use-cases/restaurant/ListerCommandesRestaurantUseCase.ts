import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotClients } from "../../ports/DepotClients";
import { DepotLivreurs } from "../../ports/DepotLivreurs";

export class ListerCommandesRestaurantUseCase {
  constructor(
    private readonly depotCommandes: DepotCommandes,
    private readonly depotClients?: DepotClients,
    private readonly depotLivreurs?: DepotLivreurs
  ) {}

  async executer(restaurantId: string): Promise<any[]> {
    let commandes = [];
    if (restaurantId === "all") {
      // Pour une démo multi-resto sans login
      commandes = await this.depotCommandes.trouverTout(); 
    } else {
      commandes = await this.depotCommandes.trouverParRestaurant(restaurantId);
    }

    if (!this.depotClients) return commandes;

    return Promise.all(commandes.map(async cmd => {
      try {
        const client = await this.depotClients!.trouverParId(cmd.clientId);
        
        let livreurNom = undefined;
        if (cmd.getLivreurId() && this.depotLivreurs) {
          try {
            const l = await this.depotLivreurs.trouverParId(cmd.getLivreurId()!);
            if (l) livreurNom = l.nom;
          } catch (_) {}
        }

        return {
          ...cmd,
          clientNom: client?.nom || 'Client Inconnu',
          clientTelephone: (client as any)?.telephone || 'Non renseigné',
          livreurNom,
          statut: cmd.getStatut(),
          creeLe: cmd.getCreeLe(),
          prixPlatsCentimes: cmd.getPrixPlats().enCentimes(),
          id: cmd.id,
          articles: cmd.getArticles(),
          adresseLivraison: cmd.getAdresseLivraison()
        };
      } catch (err) {
        return {
          ...cmd,
          clientNom: 'Client Inconnu',
          clientTelephone: 'Non renseigné',
          statut: cmd.getStatut(),
          creeLe: cmd.getCreeLe(),
          prixPlatsCentimes: cmd.getPrixPlats().enCentimes(),
          id: cmd.id,
          articles: cmd.getArticles(),
          adresseLivraison: cmd.getAdresseLivraison()
        };
      }
    }));
  }
}
