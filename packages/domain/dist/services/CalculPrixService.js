"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculPrixService = void 0;
const Money_1 = require("../value-objects/Money");
class CalculPrixService {
    static TARIF_KM = 0.5;
    static TAUX_FRAIS_SERVICE = 0.10;
    calculerFraisLivraison(distanceKm) {
        return Money_1.Money.fromEuros(distanceKm * CalculPrixService.TARIF_KM);
    }
    calculerFraisService(prixPlats) {
        return Money_1.Money.fromEuros(prixPlats.enEuros() * CalculPrixService.TAUX_FRAIS_SERVICE);
    }
    calculerSousTotalPlats(articles) {
        return articles.reduce((total, article) => total.ajouter(article.prixTotal()), Money_1.Money.zero());
    }
    getTauxReduction(points) {
        if (points >= 250)
            return 0.15;
        if (points >= 100)
            return 0.10;
        if (points >= 50)
            return 0.05;
        return 0;
    }
    calculerTotal(articles, distanceKm, tauxReduction = 0) {
        const prixPlats = this.calculerSousTotalPlats(articles);
        const fraisLivraison = this.calculerFraisLivraison(distanceKm);
        const fraisService = this.calculerFraisService(prixPlats);
        const montantReduction = Money_1.Money.fromEuros(prixPlats.enEuros() * tauxReduction);
        const total = prixPlats.ajouter(fraisLivraison).ajouter(fraisService).soustraire(montantReduction);
        return { prixPlats, fraisLivraison, fraisService, reduction: montantReduction, total };
    }
}
exports.CalculPrixService = CalculPrixService;