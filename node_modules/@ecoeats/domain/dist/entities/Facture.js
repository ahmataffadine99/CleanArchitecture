"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Facture = void 0;
class Facture {
    id;
    commandeId;
    clientId;
    articles;
    prixPlats;
    fraisLivraison;
    fraisService;
    total;
    genereLe;
    constructor(id, commandeId, clientId, articles, prixPlats, fraisLivraison, fraisService, total) {
        this.id = id;
        this.commandeId = commandeId;
        this.clientId = clientId;
        this.articles = articles;
        this.prixPlats = prixPlats;
        this.fraisLivraison = fraisLivraison;
        this.fraisService = fraisService;
        this.total = total;
        this.genereLe = new Date();
    }
    afficher() {
        const lignes = this.articles.map(a => `  - ${a.nom} x${a.quantite} : ${a.prixTotal().toString()}`);
        return [
            `=== FACTURE #${this.id} ===`,
            `Commande : ${this.commandeId}`,
            `Date : ${this.genereLe.toLocaleString()}`,
            ``,
            `Articles :`,
            ...lignes,
            ``,
            `Sous-total (plats) : ${this.prixPlats.toString()}`,
            `Frais de livraison : ${this.fraisLivraison.toString()}`,
            `Frais de service   : ${this.fraisService.toString()}`,
            ``,
            `TOTAL : ${this.total.toString()}`,
        ].join("\n");
    }
}
exports.Facture = Facture;
//# sourceMappingURL=Facture.js.map