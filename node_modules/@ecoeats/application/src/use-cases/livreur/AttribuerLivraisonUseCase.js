"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttribuerLivraisonUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
const domain_2 = require("@ecoeats/domain");
// Trouve le livreur le plus proche du restaurant et lui attribue la commande
class AttribuerLivraisonUseCase {
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
            throw new Error(`La commande ${req.commandeId} n'est pas encore prête pour la collecte.`);
        }
        const restaurant = await this.depotRestaurants.trouverParId(commande.restaurantId);
        const livreurs = await this.depotLivreurs.listerDisponibles();
        const livreurChoisi = this.selectionLivreur.trouverLePlusProche(livreurs, restaurant.position, restaurant.id);
        livreurChoisi.prendreEnCharge(commande.id);
        commande.assignerLivreur(livreurChoisi.id);
        await this.depotLivreurs.sauvegarder(livreurChoisi);
        await this.depotCommandes.sauvegarder(commande);
        return { commande, livreur: livreurChoisi };
    }
}
exports.AttribuerLivraisonUseCase = AttribuerLivraisonUseCase;
//# sourceMappingURL=AttribuerLivraisonUseCase.js.map