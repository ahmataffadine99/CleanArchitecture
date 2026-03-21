"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoirMenuRestaurantUseCase = void 0;
class VoirMenuRestaurantUseCase {
    depotPlats;
    constructor(depotPlats) {
        this.depotPlats = depotPlats;
    }
    async executer(restaurantId) {
        const plats = await this.depotPlats.trouverParRestaurant(restaurantId);
        return {
            disponibles: plats.filter(p => p.estDisponible()),
            rupture: plats.filter(p => !p.estDisponible()),
        };
    }
}
exports.VoirMenuRestaurantUseCase = VoirMenuRestaurantUseCase;
//# sourceMappingURL=VoirMenuRestaurantUseCase.js.map