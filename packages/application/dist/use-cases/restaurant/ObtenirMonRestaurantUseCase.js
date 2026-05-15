"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenirMonRestaurantUseCase = void 0;
class ObtenirMonRestaurantUseCase {
    depotRestaurants;
    constructor(depotRestaurants) {
        this.depotRestaurants = depotRestaurants;
    }
    async executer(proprietaireId) {
        return this.depotRestaurants.trouverParProprietaireId(proprietaireId);
    }
}
exports.ObtenirMonRestaurantUseCase = ObtenirMonRestaurantUseCase;