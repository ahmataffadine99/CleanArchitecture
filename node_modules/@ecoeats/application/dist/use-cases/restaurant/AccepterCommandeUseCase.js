"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccepterCommandeUseCase = void 0;
class AccepterCommandeUseCase {
    depotCommandes;
    proposerLivraison;
    constructor(depotCommandes, proposerLivraison) {
        this.depotCommandes = depotCommandes;
        this.proposerLivraison = proposerLivraison;
    }
    async executer(req) {
        const commande = await this.depotCommandes.trouverParId(req.commandeId);
        commande.accepter(req.tempsPreparationMinutes);
        await this.depotCommandes.sauvegarder(commande);
        // Tenter de trouver un livreur dès la préparation
        try {
            await this.proposerLivraison.executer({ commandeId: req.commandeId });
        }
        catch (err) {
            console.warn("Aucun livreur disponible pour le moment:", err);
        }
        return commande;
    }
}
exports.AccepterCommandeUseCase = AccepterCommandeUseCase;
//# sourceMappingURL=AccepterCommandeUseCase.js.map