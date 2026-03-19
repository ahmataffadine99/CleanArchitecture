"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayerCommandeUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
const uuid_1 = require("uuid");
class PayerCommandeUseCase {
    depotCommandes;
    depotFactures;
    servicePaiement;
    constructor(depotCommandes, depotFactures, servicePaiement) {
        this.depotCommandes = depotCommandes;
        this.depotFactures = depotFactures;
        this.servicePaiement = servicePaiement;
    }
    async executer(req) {
        const commande = await this.depotCommandes.trouverParId(req.commandeId);
        const paiement = await this.servicePaiement.encaisser(commande.prixTotal().enCentimes(), req.clientId);
        if (!paiement.success) {
            throw new Error(`Paiement refusé pour la commande ${req.commandeId}`);
        }
        commande.changerStatut(domain_1.StatutCommande.PAYEE);
        const facture = new domain_1.Facture((0, uuid_1.v4)(), commande.id, req.clientId, commande.getArticles(), commande.getPrixPlats(), commande.getFraisLivraison(), commande.getFraisService(), commande.prixTotal());
        await this.depotCommandes.sauvegarder(commande);
        await this.depotFactures.sauvegarder(facture);
        return { commande, facture };
    }
}
exports.PayerCommandeUseCase = PayerCommandeUseCase;
//# sourceMappingURL=PayerCommandeUseCase.js.map