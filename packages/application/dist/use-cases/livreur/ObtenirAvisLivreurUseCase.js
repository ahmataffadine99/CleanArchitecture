"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenirAvisLivreurUseCase = void 0;
class ObtenirAvisLivreurUseCase {
    depotAvis;
    constructor(depotAvis) {
        this.depotAvis = depotAvis;
    }
    async executer(livreurId) {
        return this.depotAvis.trouverParLivreur(livreurId);
    }
}
exports.ObtenirAvisLivreurUseCase = ObtenirAvisLivreurUseCase;