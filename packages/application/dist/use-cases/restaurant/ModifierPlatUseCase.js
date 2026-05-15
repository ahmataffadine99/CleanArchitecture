"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifierPlatUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
class ModifierPlatUseCase {
    depotPlats;
    constructor(depotPlats) {
        this.depotPlats = depotPlats;
    }
    async executer(req) {
        const plat = await this.depotPlats.trouverParId(req.platId);
        plat.mettreAJour({
            nom: req.nom,
            description: req.description,
            prix: req.prixEuros !== undefined ? domain_1.Money.fromEuros(req.prixEuros) : undefined,
            allergenes: req.allergenes,
            stockJournalier: req.stockJournalier,
            imageUrl: req.imageUrl,
            actif: req.actif,
            categorie: req.categorie,
        });
        await this.depotPlats.sauvegarder(plat);
    }
}
exports.ModifierPlatUseCase = ModifierPlatUseCase;