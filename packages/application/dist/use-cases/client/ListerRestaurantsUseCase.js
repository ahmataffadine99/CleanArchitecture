"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListerRestaurantsUseCase = void 0;
class ListerRestaurantsUseCase {
    depotRestaurants;
    constructor(depotRestaurants) {
        this.depotRestaurants = depotRestaurants;
    }
    async executer() {
        return this.depotRestaurants.listerTous();
    }
}
exports.ListerRestaurantsUseCase = ListerRestaurantsUseCase;