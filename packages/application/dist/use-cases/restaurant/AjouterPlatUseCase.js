"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AjouterPlatUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
const uuid_1 = require("uuid");
class AjouterPlatUseCase {
    depotPlats;
    depotRestaurants;
    constructor(depotPlats, depotRestaurants) {
        this.depotPlats = depotPlats;
        this.depotRestaurants = depotRestaurants;
    }
    async executer(req) {
        await this.depotRestaurants.trouverParId(req.restaurantId); // vérifie que le resto existe
        const plat = new domain_1.PlatMenu((0, uuid_1.v4)(), req.nom, req.description, req.prixEuros ? domain_1.Money.fromEuros(req.prixEuros) : domain_1.Money.zero(), req.allergenes || [], req.stockJournalier || 0, req.restaurantId, req.imageUrl, req.actif ?? true);
        await this.depotPlats.sauvegarder(plat);
        return plat;
    }
}
exports.AjouterPlatUseCase = AjouterPlatUseCase;
//# sourceMappingURL=AjouterPlatUseCase.js.map