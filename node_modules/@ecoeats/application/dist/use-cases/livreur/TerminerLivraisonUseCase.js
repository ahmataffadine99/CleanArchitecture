"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminerLivraisonUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
// Formule de rémunération livreur : 2€ prise en charge + 1€/km + pourboire 100%
// La plateforme ne prend aucune commission sur la part livreur
const PRISE_EN_CHARGE_EUROS = 2;
const TARIF_KM_LIVREUR = 1;
class TerminerLivraisonUseCase {
    depotCommandes;
    depotLivreurs;
    depotRestaurants;
    cartographie;
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
        const positionClient = { latitude: 48.8566, longitude: 2.3522 };
        const distanceKm = this.cartographie.calculerDistanceKm(restaurant.position, positionClient);
        const gains = domain_1.Money.fromEuros(PRISE_EN_CHARGE_EUROS +
            distanceKm * TARIF_KM_LIVREUR +
            (req.pourboire ?? 0));
        commande.marquerLivree();
        livreur.terminerLivraison(gains);
        await this.depotCommandes.sauvegarder(commande);
        await this.depotLivreurs.sauvegarder(livreur);
        return { livreur, gains };
    }
}
exports.TerminerLivraisonUseCase = TerminerLivraisonUseCase;
//# sourceMappingURL=TerminerLivraisonUseCase.js.map