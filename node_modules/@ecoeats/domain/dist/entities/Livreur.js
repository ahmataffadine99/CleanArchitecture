"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Livreur = void 0;
const Money_1 = require("../value-objects/Money");
const StatutLivreur_1 = require("../value-objects/StatutLivreur");
class Livreur {
    id;
    nom;
    position;
    telephone;
    statut = StatutLivreur_1.StatutLivreur.INDISPONIBLE;
    portefeuille = Money_1.Money.zero();
    commandeEnCoursId = null;
    constructor(id, nom, position, telephone) {
        this.id = id;
        this.nom = nom;
        this.position = position;
        this.telephone = telephone;
    }
    seDeclarerDisponible() {
        this.statut = StatutLivreur_1.StatutLivreur.DISPONIBLE;
    }
    seDeclarerIndisponible() {
        if (this.statut === StatutLivreur_1.StatutLivreur.EN_LIVRAISON) {
            throw new Error("Impossible de se déclarer indisponible pendant une livraison en cours");
        }
        this.statut = StatutLivreur_1.StatutLivreur.INDISPONIBLE;
    }
    prendreEnCharge(commandeId) {
        if (this.statut !== StatutLivreur_1.StatutLivreur.DISPONIBLE) {
            throw new Error(`Le livreur ${this.nom} n'est pas disponible`);
        }
        this.statut = StatutLivreur_1.StatutLivreur.EN_LIVRAISON;
        this.commandeEnCoursId = commandeId;
    }
    terminerLivraison(gains) {
        this.portefeuille = this.portefeuille.ajouter(gains);
        this.statut = StatutLivreur_1.StatutLivreur.DISPONIBLE;
        this.commandeEnCoursId = null;
    }
    estDisponible() {
        return this.statut === StatutLivreur_1.StatutLivreur.DISPONIBLE;
    }
    getStatut() { return this.statut; }
    getPortefeuille() { return this.portefeuille; }
    getCommandeEnCoursId() { return this.commandeEnCoursId; }
}
exports.Livreur = Livreur;
//# sourceMappingURL=Livreur.js.map