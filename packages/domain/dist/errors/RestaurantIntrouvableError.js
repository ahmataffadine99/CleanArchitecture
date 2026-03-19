"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantIntrouvableError = void 0;
const ErreurMetier_1 = require("./ErreurMetier");
class RestaurantIntrouvableError extends ErreurMetier_1.ErreurMetier {
    constructor(restaurantId) {
        super("RESTAURANT_INTROUVABLE", `Restaurant introuvable : ${restaurantId}`);
        this.restaurantId = restaurantId;
    }
    restaurantId;
}
exports.RestaurantIntrouvableError = RestaurantIntrouvableError;
//# sourceMappingURL=RestaurantIntrouvableError.js.map