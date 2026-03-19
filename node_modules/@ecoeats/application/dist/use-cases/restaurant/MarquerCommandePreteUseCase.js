"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarquerCommandePreteUseCase = void 0;
class MarquerCommandePreteUseCase {
    depotCommandes;
    constructor(depotCommandes) {
        this.depotCommandes = depotCommandes;
    }
    async executer(commandeId) {
        const commande = await this.depotCommandes.trouverParId(commandeId);
        commande.marquerPrete();
        await this.depotCommandes.sauvegarder(commande);
        return commande;
    }
}
exports.MarquerCommandePreteUseCase = MarquerCommandePreteUseCase;
//# sourceMappingURL=MarquerCommandePreteUseCase.js.map