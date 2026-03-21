"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenirPropositionsLivreurUseCase = void 0;
class ObtenirPropositionsLivreurUseCase {
    depotLivreurs;
    depotCommandes;
    depotRestaurants;
    cartographie;
    constructor(depotLivreurs, depotCommandes, depotRestaurants, cartographie) {
        this.depotLivreurs = depotLivreurs;
        this.depotCommandes = depotCommandes;
        this.depotRestaurants = depotRestaurants;
        this.cartographie = cartographie;
    }
    async executer(livreurId) {
        const livreur = await this.depotLivreurs.trouverParId(livreurId);
        const details = [];
        for (const commandeId of livreur.getPropositionsIds()) {
            try {
                const commande = await this.depotCommandes.trouverParId(commandeId);
                const restaurant = await this.depotRestaurants.trouverParId(commande.restaurantId);
                const distanceApproche = this.cartographie.calculerDistanceKm(livreur.position, restaurant.position);
                const distanceLivraison = this.cartographie.calculerDistanceKm(restaurant.position, commande.getPositionLivraison());
                details.push({
                    commandeId: commande.id,
                    restaurantNom: restaurant.nom,
                    restaurantAdresse: restaurant.adresse,
                    clientAdresse: commande.getAdresseLivraison(),
                    tempsPreparationEstime: commande.getTempsPreparation() || undefined,
                    montantLivraison: commande.getFraisLivraison().enEuros(),
                    distanceApprocheKm: Number(distanceApproche.toFixed(1)),
                    distanceLivraisonKm: Number(distanceLivraison.toFixed(1))
                });
            }
            catch (err) {
                console.error(`Erreur lors de la récupération de la proposition ${commandeId}:`, err);
            }
        }
        return details;
    }
}
exports.ObtenirPropositionsLivreurUseCase = ObtenirPropositionsLivreurUseCase;
//# sourceMappingURL=ObtenirPropositionsLivreurUseCase.js.map