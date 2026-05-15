"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupprimerPlatUseCase = void 0;
class SupprimerPlatUseCase {
    depotPlats;
    constructor(depotPlats) {
        this.depotPlats = depotPlats;
    }
    async executer(platId) {
        await this.depotPlats.trouverParId(platId);
        await this.depotPlats.supprimer(platId);
    }
}
exports.SupprimerPlatUseCase = SupprimerPlatUseCase;