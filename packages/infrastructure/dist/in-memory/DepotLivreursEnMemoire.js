"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotLivreursEnMemoire = void 0;
class DepotLivreursEnMemoire {
    store = new Map();
    async sauvegarder(livreur) {
        this.store.set(livreur.id, livreur);
    }
    async trouverParId(id) {
        const livreur = this.store.get(id);
        if (!livreur)
            throw new Error(`Livreur introuvable : ${id}`);
        return livreur;
    }
    async listerDisponibles() {
        return [...this.store.values()].filter(l => l.getStatut() === "DISPONIBLE");
    }
    async retirerPropositionDeTous(commandeId) {
        for (const livreur of this.store.values()) {
            livreur.refuserProposition(commandeId);
        }
    }
}
exports.DepotLivreursEnMemoire = DepotLivreursEnMemoire;