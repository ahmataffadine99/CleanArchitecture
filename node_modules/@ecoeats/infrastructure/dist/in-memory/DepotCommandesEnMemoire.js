"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotCommandesEnMemoire = void 0;
const domain_1 = require("@ecoeats/domain");
// Stockage en mémoire vive — utile pour les tests et le démarrage sans DB
class DepotCommandesEnMemoire {
    store = new Map();
    async sauvegarder(commande) {
        this.store.set(commande.id, commande);
    }
    async trouverParId(id) {
        const commande = this.store.get(id);
        if (!commande)
            throw new domain_1.CommandeIntrouvableError(id);
        return commande;
    }
    async trouverParRestaurant(restaurantId) {
        return [...this.store.values()].filter(c => c.restaurantId === restaurantId);
    }
    async trouverParClient(clientId) {
        return [...this.store.values()].filter(c => c.clientId === clientId);
    }
    async trouverParLivreur(livreurId) {
        return [...this.store.values()]
            .filter(c => c.getLivreurId() === livreurId)
            .sort((a, b) => b.getCreeLe().getTime() - a.getCreeLe().getTime());
    }
    async trouverTout() {
        return [...this.store.values()];
    }
    async trouverCommandesSansLivreur() {
        return [...this.store.values()].filter(c => ['EN_PREPARATION', 'PRETE'].includes(c.getStatut()) && !c.getLivreurId());
    }
}
exports.DepotCommandesEnMemoire = DepotCommandesEnMemoire;
//# sourceMappingURL=DepotCommandesEnMemoire.js.map