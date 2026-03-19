"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccepterLivraisonUseCase = void 0;
class AccepterLivraisonUseCase {
    depotCommandes;
    depotLivreurs;
    constructor(depotCommandes, depotLivreurs) {
        this.depotCommandes = depotCommandes;
        this.depotLivreurs = depotLivreurs;
    }
    async executer(req) {
        const livreur = await this.depotLivreurs.trouverParId(req.livreurId);
        const commande = await this.depotCommandes.trouverParId(req.commandeId);
        livreur.accepterProposition(req.commandeId);
        commande.assignerLivreur(livreur.id);
        await this.depotLivreurs.sauvegarder(livreur);
        await this.depotCommandes.sauvegarder(commande);
    }
}
exports.AccepterLivraisonUseCase = AccepterLivraisonUseCase;
//# sourceMappingURL=AccepterLivraisonUseCase.js.map