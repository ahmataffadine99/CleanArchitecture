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
        // Calcul distance restaurant → client (réelle)
        const distanceKm = this.cartographie.calculerDistanceKm(restaurant.position, commande.getPositionLivraison());
        // Sécurité : on plafonne la distance de calcul à 50km pour éviter les bugs de coordonnées (0,0)
        const distancePourGains = Math.min(distanceKm, 50.0);
        const gains = this.calculGains.calculerGains(distancePourGains, req.pourboire ? domain_1.Money.fromEuros(req.pourboire) : domain_1.Money.zero());
        commande.marquerLivree();
        livreur.terminerLivraison(commande.id, gains);
        // Promotion Expert automatique après 5 livraisons terminées
        try {
            const historique = await this.depotCommandes.trouverParLivreur(livreur.id);
            const nbLivrees = historique.filter(c => c.getStatut() === 'LIVREE').length;
            if (nbLivrees >= 5) {
                livreur.estExpert = true;
            }
        }
        catch (_) { }
        await this.depotCommandes.sauvegarder(commande);
        await this.depotLivreurs.sauvegarder(livreur);
        return { livreur, gains };
    }
}
exports.TerminerLivraisonUseCase = TerminerLivraisonUseCase;
//# sourceMappingURL=TerminerLivraisonUseCase.js.map