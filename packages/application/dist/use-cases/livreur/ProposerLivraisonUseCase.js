"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposerLivraisonUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
class ProposerLivraisonUseCase {
    depotCommandes;
    depotLivreurs;
    depotRestaurants;
    cartographie;
    RAYON_ACTION_KM = 30.0;
    constructor(depotCommandes, depotLivreurs, depotRestaurants, cartographie) {
        this.depotCommandes = depotCommandes;
        this.depotLivreurs = depotLivreurs;
        this.depotRestaurants = depotRestaurants;
        this.cartographie = cartographie;
    }
    async executer(req) {
        const commande = await this.depotCommandes.trouverParId(req.commandeId);
        const statut = commande.getStatut();
        if (statut !== domain_1.StatutCommande.PRETE && statut !== domain_1.StatutCommande.EN_PREPARATION) {
            throw new Error(`La commande ${req.commandeId} n'est pas encore prête ou en préparation.`);
        }
        const restaurant = await this.depotRestaurants.trouverParId(commande.restaurantId);
        const livreursEligibles = await this.depotLivreurs.listerEligiblesPourRestaurant(commande.restaurantId);
        const livreursProches = livreursEligibles.filter(livreur => {
            const distance = this.cartographie.calculerDistanceKm(restaurant.position, livreur.position);
            return distance <= this.RAYON_ACTION_KM;
        });
        for (const livreur of livreursProches) {
            livreur.recevoirProposition(commande.id);
            await this.depotLivreurs.sauvegarder(livreur);
        }
        return livreursProches[0];
    }
}
exports.ProposerLivraisonUseCase = ProposerLivraisonUseCase;