"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartographieHaversine = void 0;
const domain_1 = require("@ecoeats/domain");
// Implémentation concrète du port ServiceCartographie via la formule Haversine
// Simule ce qu'une vraie API Maps (Google, etc.) ferait
class CartographieHaversine {
    calculateur = new domain_1.CalculDistanceService();
    calculerDistanceKm(pointA, pointB) {
        return this.calculateur.calculerKm(pointA, pointB);
    }
}
exports.CartographieHaversine = CartographieHaversine;
//# sourceMappingURL=CartographieHaversine.js.map