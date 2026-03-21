"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotRestaurantsEnMemoire = void 0;
const domain_1 = require("@ecoeats/domain");
class DepotRestaurantsEnMemoire {
    store = new Map();
    async sauvegarder(restaurant) {
        this.store.set(restaurant.id, restaurant);
    }
    async trouverParId(id) {
        const resto = this.store.get(id);
        if (!resto)
            throw new domain_1.RestaurantIntrouvableError(id);
        return resto;
    }
    async listerTous() {
        return [...this.store.values()];
    }
    async trouverParProprietaireId(proprietaireId) {
        return [...this.store.values()].find(r => r.proprietaireId === proprietaireId) || null;
    }
}
exports.DepotRestaurantsEnMemoire = DepotRestaurantsEnMemoire;
//# sourceMappingURL=DepotRestaurantsEnMemoire.js.map