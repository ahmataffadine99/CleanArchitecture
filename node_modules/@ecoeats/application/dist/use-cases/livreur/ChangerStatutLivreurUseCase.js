"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangerStatutLivreurUseCase = void 0;
class ChangerStatutLivreurUseCase {
    depotLivreurs;
    constructor(depotLivreurs) {
        this.depotLivreurs = depotLivreurs;
    }
    async executer(req) {
        const livreur = await this.depotLivreurs.trouverParId(req.livreurId);
        if (req.statut === "DISPONIBLE") {
            livreur.seDeclarerDisponible();
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