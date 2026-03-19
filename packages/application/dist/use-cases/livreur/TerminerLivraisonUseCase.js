"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminerLivraisonUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
class TerminerLivraisonUseCase {
    depotCommandes;
    depotLivreurs;
    depotRestaurants;
    cartographie;
    calculGains = new domain_1.CalculGainsLivreurService();
    constructor(depotCommandes, depotLivreurs, depotRestaurants, cartographie) {
        this.depotCommandes = depotCommandes;
        this.depotLivreurs = depotLivreurs;
        this.depotRestaurants = depotRestaurants;
        this.cartographie = cartographie;
    }
    async executer(req) {
        const commande = await this.depotCommandes.trouverParId(req.commandeId);
        const livreur = await this.depotLivreurs.trouverParId(req.livreurId);
        const restaurant = await this.depotRestaurants.trouverParId(commande.restaurantId);
        // Calcul distance restaurant → client (simulation)
        // On utilise Paris centre par défaut pour la démo si non spécifié
        const positionClient = { latitude: 48.8566, longitude: 2.3522 };
        const distanceKm = this.cartographie.calculerDistanceKm(restaurant.position, positionClient);
        const gains = this.calculGains.calculerGains(distanceKm, req.pourboire ? domain_1.Money.fromEuros(req.pourboire) : domain_1.Money.zero());
        commande.marquerLivree();
        livreur.terminerLivraison(commande.id, gains);
        await this.depotCommandes.sauvegarder(commande);
        await this.depotLivreurs.sauvegarder(livreur);
        return { livreur, gains };
    }
}
exports.TerminerLivraisonUseCase = TerminerLivraisonUseCase;
//# sourceMappingURL=TerminerLivraisonUseCase.js.map