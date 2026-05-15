"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotPlatsEnMemoire = void 0;
const domain_1 = require("@ecoeats/domain");
class DepotPlatsEnMemoire {
    store = new Map();
    async sauvegarder(plat) {
        this.store.set(plat.id, plat);
    }
    async trouverParId(id) {
        const plat = this.store.get(id);
        if (!plat)
            throw new domain_1.PlatIntrouvableError(id);
        return plat;
    }
    async trouverParRestaurant(restaurantId) {
        return [...this.store.values()].filter(p => p.restaurantId === restaurantId);
    }
    async supprimer(id) {
        this.store.delete(id);
    }
}
exports.DepotPlatsEnMemoire = DepotPlatsEnMemoire;