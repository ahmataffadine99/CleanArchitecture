"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionLivreurService = void 0;
const CalculDistanceService_1 = require("./CalculDistanceService");
const AucunLivreurDisponibleError_1 = require("../errors/AucunLivreurDisponibleError");
// Sélectionne le livreur disponible le plus proche du restaurant
class SelectionLivreurService {
    calculDistance = new CalculDistanceService_1.CalculDistanceService();
    trouverLePlusProche(livreurs, positionRestaurant, restaurantId) {
        const dispos = livreurs.filter(l => l.estDisponible());
        if (dispos.length === 0) {
            throw new AucunLivreurDisponibleError_1.AucunLivreurDisponibleError(restaurantId);
        }
        return dispos.reduce((lePlusProche, livreur) => {
            const distActuel = this.calculDistance.calculerKm(livreur.position, positionRestaurant);
            const distPlusProche = this.calculDistance.calculerKm(lePlusProche.position, positionRestaurant);
            return distActuel < distPlusProche ? livreur : lePlusProche;
        });
    }
}
exports.SelectionLivreurService = SelectionLivreurService;
//# sourceMappingURL=SelectionLivreurService.js.map