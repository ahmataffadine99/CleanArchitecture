"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AucunLivreurDisponibleError = void 0;
const ErreurMetier_1 = require("./ErreurMetier");
class AucunLivreurDisponibleError extends ErreurMetier_1.ErreurMetier {
    constructor(restaurantId) {
        super("AUCUN_LIVREUR_DISPONIBLE", `Aucun livreur disponible à proximité du restaurant ${restaurantId}.`);
        this.restaurantId = restaurantId;
    }
    restaurantId;
}
exports.AucunLivreurDisponibleError = AucunLivreurDisponibleError;
//# sourceMappingURL=AucunLivreurDisponibleError.js.map