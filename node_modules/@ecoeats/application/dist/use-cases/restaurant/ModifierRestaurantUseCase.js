"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifierRestaurantUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
class ModifierRestaurantUseCase {
    depotRestaurants;
    constructor(depotRestaurants) {
        this.depotRestaurants = depotRestaurants;
    }
    async executer(req) {
        const restaurant = await this.depotRestaurants.trouverParId(req.restaurantId);
        if (req.nom !== undefined)
            restaurant.nom = req.nom;
        if (req.adresse !== undefined)
            restaurant.adresse = req.adresse;
        if (req.imageUrl !== undefined)
            restaurant.imageUrl = req.imageUrl;
        if (req.latitude !== undefined && req.longitude !== undefined) {
            restaurant.position = new domain_1.Coordonnees(req.latitude, req.longitude);
        }
        await this.depotRestaurants.sauvegarder(restaurant);
    }
}
exports.ModifierRestaurantUseCase = ModifierRestaurantUseCase;
//# sourceMappingURL=ModifierRestaurantUseCase.js.map