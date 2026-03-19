"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposerLivraisonUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
const domain_2 = require("@ecoeats/domain");
// Trouve le livreur le plus proche et lui envoie une proposition
class ProposerLivraisonUseCase {
    depotCommandes;
    depotLivreurs;
    depotRestaurants;
    selectionLivreur = new domain_2.SelectionLivreurService();
    constructor(depotCommandes, depotLivreurs, depotRestaurants) {
        this.depotCommandes = depotCommandes;
        this.depotLivreurs = depotLivreurs;
        this.depotRestaurants = depotRestaurants;
    }
    async executer(req) {
        const commande = await this.depotCommandes.trouverParId(req.commandeId);
        if (commande.getStatut() !== domain_1.StatutCommande.PRETE) {
            throw new Error(`La commande ${req.commandeId} n'est pas encore prête.`);
        }
        const restaurant = await this.depotRestaurants.trouverParId(commande.restaurantId);
        const livreurs = await this.depotLivreurs.listerDisponibles();
        const livreurChoisi = this.selectionLivreur.trouverLePlusProche(livreurs, restaurant.position, restaurant.id);
        livreurChoisi.recevoirProposition(commande.id);
        await this.depotLivreurs.sauvegarder(livreurChoisi);
        return livreurChoisi;
    }
}
exports.ProposerLivraisonUseCase = ProposerLivraisonUseCase;
//# sourceMappingURL=ProposerLivraisonUseCase.js.map