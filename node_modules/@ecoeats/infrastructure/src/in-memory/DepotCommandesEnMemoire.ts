import { Commande, Coordonnees } from "@ecoeats/domain";
import { CommandeIntrouvableError } from "@ecoeats/domain";
import { DepotCommandes } from "@ecoeats/application";

// Stockage en mémoire vive — utile pour les tests et le démarrage sans DB
export class DepotCommandesEnMemoire implements DepotCommandes {
  private readonly store = new Map<string, Commande>();

  async sauvegarder(commande: Commande): Promise<void> {
    this.store.set(commande.id, commande);
  }

  async trouverParId(id: string): Promise<Commande> {
    const commande = this.store.get(id);
    if (!commande) throw new CommandeIntrouvableError(id);
    return commande;
  }

  async trouverParRestaurant(restaurantId: string): Promise<Commande[]> {
    return [...this.store.values()].filter(c => c.restaurantId === restaurantId);
  }

  async trouverParClient(clientId: string): Promise<Commande[]> {
    return [...this.store.values()].filter(c => c.clientId === clientId);
  }

  async trouverParLivreur(livreurId: string): Promise<Commande[]> {
    return [...this.store.values()]
      .filter(c => c.getLivreurId() === livreurId)
      .sort((a, b) => b.getCreeLe().getTime() - a.getCreeLe().getTime());
  }

  async trouverTout(): Promise<Commande[]> {
    return [...this.store.values()];
  }

  async trouverCommandesSansLivreur(): Promise<Commande[]> {
    return [...this.store.values()].filter(c => 
      ['EN_PREPARATION', 'PRETE'].includes(c.getStatut()) && !c.getLivreurId()
    );
  }
}
