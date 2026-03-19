"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListerCommandesClientUseCase = void 0;
class ListerCommandesClientUseCase {
    depotCommandes;
    constructor(depotCommandes) {
        this.depotCommandes = depotCommandes;
    }
    async executer(clientId) {
        return this.depotCommandes.trouverParClient(clientId);
    }
}
exports.ListerCommandesClientUseCase = ListerCommandesClientUseCase;
//# sourceMappingURL=ListerCommandesClientUseCase.js.map