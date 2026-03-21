"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangerStatutLivreurUseCase = void 0;
class ChangerStatutLivreurUseCase {
    depotLivreurs;
    depotCommandes;
    depotRestaurants;
    cartographie;
    RAYON_ACTION_KM = 30.0;
    constructor(depotLivreurs, depotCommandes, depotRestaurants, cartographie) {
        this.depotLivreurs = depotLivreurs;
        this.depotCommandes = depotCommandes;
        this.depotRestaurants = depotRestaurants;
        this.cartographie = cartographie;
    }
    async executer(req) {
        const livreur = await this.depotLivreurs.trouverParId(req.livreurId);
        if (req.statut === "DISPONIBLE") {
            livreur.seDeclarerDisponible();
            // Assigner les propositions en attente (seulement celles à proximité)
            const commandesSansLivreur = await this.depotCommandes.trouverCommandesSansLivreur();
            for (const cmd of commandesSansLivreur) {
                const restaurant = await this.depotRestaurants.trouverParId(cmd.restaurantId);
                const distance = this.cartographie.calculerDistanceKm(restaurant.position, livreur.position);
                if (distance <= this.RAYON_ACTION_KM) {
                    livreur.recevoirProposition(cmd.id);
                }
            }
        }
        else {
            livreur.seDeclarerIndisponible();
        }
        await this.depotLivreurs.sauvegarder(livreur);
        return livreur;
    }
}
exports.ChangerStatutLivreurUseCase = ChangerStatutLivreurUseCase;
//# sourceMappingURL=ChangerStatutLivreurUseCase.js.map