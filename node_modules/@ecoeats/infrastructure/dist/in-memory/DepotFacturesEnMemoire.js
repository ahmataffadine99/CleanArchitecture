"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotFacturesEnMemoire = void 0;
class DepotFacturesEnMemoire {
    store = new Map();
    async sauvegarder(facture) {
        this.store.set(facture.commandeId, facture);
    }
    async trouverParCommande(commandeId) {
        return this.store.get(commandeId) ?? null;
    }
}
exports.DepotFacturesEnMemoire = DepotFacturesEnMemoire;
//# sourceMappingURL=DepotFacturesEnMemoire.js.map