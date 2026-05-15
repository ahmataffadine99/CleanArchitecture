"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GererFavorisUseCase = void 0;
class GererFavorisUseCase {
    depotFavoris;
    constructor(depotFavoris) {
        this.depotFavoris = depotFavoris;
    }
    async ajouterRestaurant(clientId, restaurantId) {
        await this.depotFavoris.ajouterRestaurant(clientId, restaurantId);
    }
    async retirerRestaurant(clientId, restaurantId) {
        await this.depotFavoris.retirerRestaurant(clientId, restaurantId);
    }
    async listerRestaurants(clientId) {
        return this.depotFavoris.listerRestaurants(clientId);
    }
    async ajouterPlat(clientId, platId) {
        await this.depotFavoris.ajouterPlat(clientId, platId);
    }
    async retirerPlat(clientId, platId) {
        await this.depotFavoris.retirerPlat(clientId, platId);
    }
    async listerPlats(clientId) {
        return this.depotFavoris.listerPlats(clientId);
    }
}
exports.GererFavorisUseCase = GererFavorisUseCase;