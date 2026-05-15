"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefuserLivraisonUseCase = void 0;
class RefuserLivraisonUseCase {
    depotLivreurs;
    constructor(depotLivreurs) {
        this.depotLivreurs = depotLivreurs;
    }
    async executer(req) {
        const livreur = await this.depotLivreurs.trouverParId(req.livreurId);
        livreur.refuserProposition(req.commandeId);
        await this.depotLivreurs.sauvegarder(livreur);
    }
}
exports.RefuserLivraisonUseCase = RefuserLivraisonUseCase;