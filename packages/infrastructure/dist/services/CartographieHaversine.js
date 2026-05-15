"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartographieHaversine = void 0;
const domain_1 = require("@ecoeats/domain");
class CartographieHaversine {
    calculateur = new domain_1.CalculDistanceService();
    calculerDistanceKm(pointA, pointB) {
        return this.calculateur.calculerKm(pointA, pointB);
    }
}
exports.CartographieHaversine = CartographieHaversine;