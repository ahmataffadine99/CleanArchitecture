"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccepterCommandeUseCase = void 0;
class AccepterCommandeUseCase {
    depotCommandes;
    constructor(depotCommandes) {
        this.depotCommandes = depotCommandes;
    }
    async executer(req) {
        const commande = await this.depotCommandes.trouverParId(req.commandeId);
        commande.accepter(req.tempsPreparationMinutes);
        await this.depotCommandes.sauvegarder(commande);
        return commande;
    }
}
exports.AccepterCommandeUseCase = AccepterCommandeUseCase;
//# sourceMappingURL=AccepterCommandeUseCase.js.map