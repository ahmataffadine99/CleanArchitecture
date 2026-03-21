"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenirCommandeUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
class ObtenirCommandeUseCase {
    depotCommandes;
    depotRestaurants;
    constructor(depotCommandes, depotRestaurants) {
        this.depotCommandes = depotCommandes;
        this.depotRestaurants = depotRestaurants;
    }
    async executer(commandeId) {
        const commande = await this.depotCommandes.trouverParId(commandeId);
        if (!commande)
            throw new domain_1.CommandeIntrouvableError(commandeId);
        let coordonneesRestaurant = { latitude: 48.8566, longitude: 2.3522 };
        try {
            const r = await this.depotRestaurants.trouverParId(commande.restaurantId);
            coordonneesRestaurant = { latitude: r.position.latitude, longitude: r.position.longitude };
        }
        catch (_) { }
        return {
            id: commande.id,
            restaurantId: commande.restaurantId,
            clientId: commande.clientId,
            statut: commande.getStatut(),
            prixTotal: commande.prixTotal().enEuros(),
            creeLe: commande.getCreeLe(),
            articles: commande.getArticles().map(a => ({
                nom: a.nom,
                quantite: a.quantite,
                prix: a.prixSnapshot.enEuros()
            })),
            adresseLivraison: commande.getAdresseLivraison(),
            clientPosition: {
                latitude: commande.getPositionLivraison().latitude,
                longitude: commande.getPositionLivraison().longitude
            },
            restaurantPosition: coordonneesRestaurant
        };
    }
}
exports.ObtenirCommandeUseCase = ObtenirCommandeUseCase;
//# sourceMappingURL=ObtenirCommandeUseCase.js.map