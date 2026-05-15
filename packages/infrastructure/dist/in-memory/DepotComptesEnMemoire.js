"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotComptesEnMemoire = void 0;
class DepotComptesEnMemoire {
    store = new Map();
    async sauvegarder(compte) {
        this.store.set(compte.email, compte);
    }
    async trouverParEmail(email) {
        return this.store.get(email) ?? null;
    }
    async trouverParId(id) {
        for (const compte of this.store.values()) {
            if (compte.id === id)
                return compte;
        }
        return null;
    }
}
exports.DepotComptesEnMemoire = DepotComptesEnMemoire;