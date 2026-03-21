"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupprimerPlatUseCase = void 0;
class SupprimerPlatUseCase {
    depotPlats;
    constructor(depotPlats) {
        this.depotPlats = depotPlats;
    }
    async executer(platId) {
        await this.depotPlats.trouverParId(platId); // s'assure qu'il existe
        await this.depotPlats.supprimer(platId);
    }
}
exports.SupprimerPlatUseCase = SupprimerPlatUseCase;
//# sourceMappingURL=SupprimerPlatUseCase.js.map