import { Livreur } from "@ecoeats/domain";
import { DepotLivreurs } from "@ecoeats/application";

export class DepotLivreursEnMemoire implements DepotLivreurs {
  private readonly store = new Map<string, Livreur>();

  async sauvegarder(livreur: Livreur): Promise<void> {
    this.store.set(livreur.id, livreur);
  }

  async trouverParId(id: string): Promise<Livreur> {
    const livreur = this.store.get(id);
    if (!livreur) throw new Error(`Livreur introuvable : ${id}`);
    return livreur;
  }

  async listerDisponibles(): Promise<Livreur[]> {
    return [...this.store.values()].filter(l => l.getStatut() === "DISPONIBLE");
  }

  async listerEligiblesPourRestaurant(restaurantId: string): Promise<Livreur[]> {
    // Dans la version en mémoire, on retourne tous les disponibles (pas de filtrage par secteur)
    return this.listerDisponibles();
  }

  async retirerPropositionDeTous(commandeId: string): Promise<void> {
    for (const livreur of this.store.values()) {
      livreur.refuserProposition(commandeId);
    }
  }

  async listerTout(): Promise<Livreur[]> {
    return [...this.store.values()];
  }
}
