"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListerCommandesRestaurantUseCase = void 0;
class ListerCommandesRestaurantUseCase {
    depotCommandes;
    depotClients;
    constructor(depotCommandes, depotClients) {
        this.depotCommandes = depotCommandes;
        this.depotClients = depotClients;
    }
    async executer(restaurantId) {
        let commandes = [];
        if (restaurantId === "all") {
            // Pour une démo multi-resto sans login
            commandes = await this.depotCommandes.trouverTout();
        }
        else {
            commandes = await this.depotCommandes.trouverParRestaurant(restaurantId);
        }
        if (!this.depotClients)
            return commandes;
        return Promise.all(commandes.map(async (cmd) => {
            try {
                const client = await this.depotClients.trouverParId(cmd.clientId);
                return {
                    ...cmd,
                    clientNom: client.nom,
                    clientTelephone: client.telephone || 'Non renseigné',
                    statut: cmd.getStatut(),
                    creeLe: cmd.getCreeLe(),
                    prixPlatsCentimes: cmd.getPrixPlats().enCentimes(),
                    id: cmd.id,
                    articles: cmd.getArticles(),
                    adresseLivraison: cmd.getAdresseLivraison()
                };
            }
            catch (err) {
                return {
                    ...cmd,
                    clientNom: 'Client Inconnu',
                    clientTelephone: 'Non renseigné',
                    statut: cmd.getStatut(),
                    creeLe: cmd.getCreeLe(),
                    prixPlatsCentimes: cmd.getPrixPlats().enCentimes(),
                    id: cmd.id,
                    articles: cmd.getArticles(),
                    adresseLivraison: cmd.getAdresseLivraison()
                };
            }
        }));
    }
}
exports.ListerCommandesRestaurantUseCase = ListerCommandesRestaurantUseCase;
//# sourceMappingURL=ListerCommandesRestaurantUseCase.js.map