"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListerHistoriqueLivreurUseCase = void 0;
class ListerHistoriqueLivreurUseCase {
    depotCommandes;
    depotRestaurants;
    constructor(depotCommandes, depotRestaurants) {
        this.depotCommandes = depotCommandes;
        this.depotRestaurants = depotRestaurants;
    }
    async executer(livreurId) {
        const commandes = await this.depotCommandes.trouverParLivreur(livreurId);
        const commandesTerminees = commandes.filter(cmd => cmd.getStatut() === 'LIVREE');
        return Promise.all(commandesTerminees.map(async (cmd) => {
            let restaurantNom = "Restaurant";
            try {
                const r = await this.depotRestaurants.trouverParId(cmd.restaurantId);
                restaurantNom = r.nom;
            }
            catch (_) { }
            return {
                id: cmd.id,
                statut: cmd.getStatut(),
                creeLe: cmd.getCreeLe(),
                gainsCentimes: cmd.getFraisLivraison().enCentimes(),
                restaurantNom
            };
        }));
    }
}
exports.ListerHistoriqueLivreurUseCase = ListerHistoriqueLivreurUseCase;