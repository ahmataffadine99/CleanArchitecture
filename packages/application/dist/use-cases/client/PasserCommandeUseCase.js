"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasserCommandeUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
const domain_2 = require("@ecoeats/domain");
const uuid_1 = require("uuid");
class PasserCommandeUseCase {
    depotCommandes;
    depotRestaurants;
    depotClients;
    depotPlats;
    cartographie;
    calculPrix = new domain_2.CalculPrixService();
    constructor(depotCommandes, depotRestaurants, depotClients, depotPlats, cartographie) {
        this.depotCommandes = depotCommandes;
        this.depotRestaurants = depotRestaurants;
        this.depotClients = depotClients;
        this.depotPlats = depotPlats;
        this.cartographie = cartographie;
    }
    async executer(req) {
        if (req.panier.estVide()) {
            throw new Error("Impossible de passer une commande avec un panier vide.");
        }
        const client = await this.depotClients.trouverParId(req.clientId);
        const restaurantId = req.panier.getRestaurantId();
        const restaurant = await this.depotRestaurants.trouverParId(restaurantId);
        // Simulation position client à partir de son adresse (coordonnées fixes pour la démo)
        const positionClient = { latitude: 48.8566, longitude: 2.3522 }; // Paris centre par défaut
        const distanceKm = this.cartographie.calculerDistanceKm(restaurant.position, positionClient);
        // Vérifier que les stocks sont toujours OK et les baisser
        for (const article of req.panier.getArticles()) {
            const plat = await this.depotPlats.trouverParId(article.menuItemId);
            plat.diminuerStock(article.quantite);
            await this.depotPlats.sauvegarder(plat);
        }
        // Calculer la réduction basée sur les points de fidélité
        const points = client.getPointsFidelite ? client.getPointsFidelite() : 0;
        const tauxReduction = this.calculPrix.getTauxReduction(points);
        const { prixPlats, fraisLivraison, fraisService, reduction } = this.calculPrix.calculerTotal(req.panier.getArticles(), distanceKm, tauxReduction);
        const commande = new domain_1.Commande((0, uuid_1.v4)(), req.clientId, restaurantId, [...req.panier.getArticles()], prixPlats, fraisLivraison, fraisService, req.adresseLivraison, reduction);
        await this.depotCommandes.sauvegarder(commande);
        req.panier.vider();
        return commande;
    }
}
exports.PasserCommandeUseCase = PasserCommandeUseCase;
//# sourceMappingURL=PasserCommandeUseCase.js.map