"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListerCommandesRestaurantUseCase = void 0;
class ListerCommandesRestaurantUseCase {
    depotCommandes;
    constructor(depotCommandes) {
        this.depotCommandes = depotCommandes;
    }
    async executer(restaurantId) {
        if (restaurantId === "all") {
            // Pour une démo multi-resto sans login
            return this.depotCommandes.trouverTout();
        }
        return this.depotCommandes.trouverParRestaurant(restaurantId);
    }
}
exports.ListerCommandesRestaurantUseCase = ListerCommandesRestaurantUseCase;
//# sourceMappingURL=ListerCommandesRestaurantUseCase.js.map