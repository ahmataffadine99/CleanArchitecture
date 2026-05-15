"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecupererCommandeUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
class RecupererCommandeUseCase {
    depotCommandes;
    depotLivreurs;
    constructor(depotCommandes, depotLivreurs) {
        this.depotCommandes = depotCommandes;
        this.depotLivreurs = depotLivreurs;
    }
    async executer(req) {
        const commande = await this.depotCommandes.trouverParId(req.commandeId);
        if (!commande)
            throw new domain_1.CommandeIntrouvableError(req.commandeId);
        if (commande.getLivreurId() !== req.livreurId) {
            throw new Error("Ce livreur n'est pas assigné à cette commande.");
        }
        commande.recuperer();
        await this.depotCommandes.sauvegarder(commande);
    }
}
exports.RecupererCommandeUseCase = RecupererCommandeUseCase;