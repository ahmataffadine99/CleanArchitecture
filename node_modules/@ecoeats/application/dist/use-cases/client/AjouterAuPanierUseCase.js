"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AjouterAuPanierUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
const domain_2 = require("@ecoeats/domain");
// Retourne le panier mis à jour ou l'erreur si conflit de restaurant
class AjouterAuPanierUseCase {
    depotPlats;
    depotClients;
    paniers = new Map();
    constructor(depotPlats, depotClients) {
        this.depotPlats = depotPlats;
        this.depotClients = depotClients;
    }
    async executer(req) {
        await this.depotClients.trouverParId(req.clientId); // vérifie que le client existe
        const plat = await this.depotPlats.trouverParId(req.platId);
        if (!plat.estDisponible()) {
            throw new domain_2.PlatEnRuptureError(plat.id);
        }
        const panier = this.obtenirOuCreerPanier(req.clientId);
        const article = new domain_1.ArticlePanier(plat.id, plat.nom, plat.prix, req.quantite, plat.restaurantId);
        panier.ajouterArticle(article); // lève PanierConflitRestaurantError si conflit
        return panier;
    }
    viderPanier(clientId) {
        const panier = this.paniers.get(clientId);
        if (panier)
            panier.vider();
    }
    retirerDuPanier(clientId, platId) {
        const panier = this.paniers.get(clientId);
        if (panier) {
            panier.retirerArticle(platId);
        }
    }
    getTousLesPaniersParRestaurant(restaurantId) {
        return Array.from(this.paniers.values()).filter(p => !p.estVide() && p.getRestaurantId() === restaurantId);
    }
    getPanier(clientId) {
        return this.paniers.get(clientId) ?? null;
    }
    obtenirOuCreerPanier(clientId) {
        if (!this.paniers.has(clientId)) {
            this.paniers.set(clientId, new domain_1.Panier(clientId));
        }
        return this.paniers.get(clientId);
    }
}
exports.AjouterAuPanierUseCase = AjouterAuPanierUseCase;
//# sourceMappingURL=AjouterAuPanierUseCase.js.map