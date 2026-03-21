"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaisserAvisLivreurUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
const uuid_1 = require("uuid");
class LaisserAvisLivreurUseCase {
    depotAvis;
    depotCommandes;
    constructor(depotAvis, depotCommandes) {
        this.depotAvis = depotAvis;
        this.depotCommandes = depotCommandes;
    }
    async executer(params) {
        const commande = await this.depotCommandes.trouverParId(params.commandeId);
        if (!commande)
            throw new Error("Commande introuvable");
        const livreurId = commande.getLivreurId();
        if (!livreurId)
            throw new Error("Cette commande n'a pas de livreur associé");
        if (commande.getStatut() !== "LIVREE")
            throw new Error("Vous ne pouvez noter qu'une commande livrée");
        const avis = new domain_1.Avis((0, uuid_1.v4)(), params.commandeId, livreurId, commande.clientId, params.note, params.commentaire || null);
        await this.depotAvis.sauvegarder(avis);
    }
}
exports.LaisserAvisLivreurUseCase = LaisserAvisLivreurUseCase;
//# sourceMappingURL=LaisserAvisLivreurUseCase.js.map