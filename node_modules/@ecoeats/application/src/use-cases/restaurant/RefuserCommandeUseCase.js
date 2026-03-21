"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefuserCommandeUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
class RefuserCommandeUseCase {
    depotCommandes;
    constructor(depotCommandes) {
        this.depotCommandes = depotCommandes;
    }
    async executer(commandeId) {
        const commande = await this.depotCommandes.trouverParId(commandeId);
        commande.changerStatut(domain_1.StatutCommande.REFUSEE);
        await this.depotCommandes.sauvegarder(commande);
        return commande;
    }
}
exports.RefuserCommandeUseCase = RefuserCommandeUseCase;
//# sourceMappingURL=RefuserCommandeUseCase.js.map