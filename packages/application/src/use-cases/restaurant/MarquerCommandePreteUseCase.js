"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarquerCommandePreteUseCase = void 0;
class MarquerCommandePreteUseCase {
    depotCommandes;
    proposerLivraison;
    constructor(depotCommandes, proposerLivraison) {
        this.depotCommandes = depotCommandes;
        this.proposerLivraison = proposerLivraison;
    }
    async executer(commandeId) {
        const commande = await this.depotCommandes.trouverParId(commandeId);
        commande.marquerPrete();
        await this.depotCommandes.sauvegarder(commande);
        // Tenter de trouver un livreur immédiatement
        try {
            await this.proposerLivraison.executer({ commandeId });
        }
        catch (err) {
            console.warn("Aucun livreur disponible pour le moment:", err);
        }
        return commande;
    }
}
exports.MarquerCommandePreteUseCase = MarquerCommandePreteUseCase;
//# sourceMappingURL=MarquerCommandePreteUseCase.js.map