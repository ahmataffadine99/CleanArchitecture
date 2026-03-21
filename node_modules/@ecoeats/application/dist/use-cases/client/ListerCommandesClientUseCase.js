"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListerCommandesClientUseCase = void 0;
class ListerCommandesClientUseCase {
    depotCommandes;
    depotRestaurants;
    depotLivreurs;
    constructor(depotCommandes, depotRestaurants, depotLivreurs) {
        this.depotCommandes = depotCommandes;
        this.depotRestaurants = depotRestaurants;
        this.depotLivreurs = depotLivreurs;
    }
    async executer(clientId) {
        const commandes = await this.depotCommandes.trouverParClient(clientId);
        return Promise.all(commandes.map(async (cmd) => {
            let restaurantNom = "Restaurant";
            let restaurantPosition = { latitude: 48.8566, longitude: 2.3522 };
            try {
                const r = await this.depotRestaurants.trouverParId(cmd.restaurantId);
                restaurantNom = r.nom;
                restaurantPosition = { latitude: r.position.latitude, longitude: r.position.longitude };
            }
            catch (_) { }
            let livreurNom = undefined;
            let livreurPosition = undefined; // Pourrait provenir du livreur s'il transmet sa position
            if (cmd.getLivreurId()) {
                try {
                    const l = await this.depotLivreurs.trouverParId(cmd.getLivreurId());
                    livreurNom = l.nom;
                }
                catch (_) { }
            }
            return {
                ...cmd,
                id: cmd.id,
                statut: cmd.getStatut(),
                prixTotal: cmd.prixTotal().enEuros(),
                creeLe: cmd.getCreeLe(),
                tempsPreparationEstime: cmd.getTempsPreparation(),
                restaurantNom,
                livreurNom,
                adresseLivraison: cmd.getAdresseLivraison(),
                clientPosition: {
                    latitude: cmd.getPositionLivraison().latitude,
                    longitude: cmd.getPositionLivraison().longitude
                },
                restaurantPosition,
                livreurPosition
            };
        }));
    }
}
exports.ListerCommandesClientUseCase = ListerCommandesClientUseCase;
//# sourceMappingURL=ListerCommandesClientUseCase.js.map