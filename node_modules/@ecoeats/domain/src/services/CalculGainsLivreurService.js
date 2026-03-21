"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculGainsLivreurService = void 0;
const Money_1 = require("../value-objects/Money");
class CalculGainsLivreurService {
    static PRISE_EN_CHARGE = 2.50; // Euros
    static PRIX_KM = 1.00; // Euros par KM
    /**
     * Formule : Prise en charge + (Distance * Prix_KM) + Pourboire
     */
    calculerGains(distanceKm, pourboire = Money_1.Money.zero()) {
        const montantKm = Money_1.Money.fromEuros(distanceKm * CalculGainsLivreurService.PRIX_KM);
        const priseEnCharge = Money_1.Money.fromEuros(CalculGainsLivreurService.PRISE_EN_CHARGE);
        return priseEnCharge.ajouter(montantKm).ajouter(pourboire);
    }
}
exports.CalculGainsLivreurService = CalculGainsLivreurService;
//# sourceMappingURL=CalculGainsLivreurService.js.map