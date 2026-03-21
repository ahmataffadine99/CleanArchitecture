"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenirLivreurUseCase = void 0;
class ObtenirLivreurUseCase {
    depotLivreurs;
    constructor(depotLivreurs) {
        this.depotLivreurs = depotLivreurs;
    }
    async executer(livreurId) {
        return this.depotLivreurs.trouverParId(livreurId);
    }
}
exports.ObtenirLivreurUseCase = ObtenirLivreurUseCase;
//# sourceMappingURL=ObtenirLivreurUseCase.js.map