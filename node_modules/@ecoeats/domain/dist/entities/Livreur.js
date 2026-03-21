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
    commandesEnCoursIds = [];
    propositionsIds = [];
    estExpert = false;
    currentRestaurantId;
    constructor(id, nom, position, telephone, estExpert = false, portefeuille = Money_1.Money.zero(), propositionsIds = [], currentRestaurantId) {
        this.id = id;
        this.nom = nom;
        this.position = position;
        this.telephone = telephone;
        this.estExpert = estExpert;
        this.portefeuille = portefeuille;
        this.propositionsIds = propositionsIds;
        this.currentRestaurantId = currentRestaurantId;
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
    prendreEnCharge(commandeId, restaurantId) {
        if (this.statut === StatutLivreur_1.StatutLivreur.INDISPONIBLE) {
            throw new Error(`Le livreur ${this.nom} n'est pas disponible`);
        }
        const nbMax = this.estExpert ? 2 : 1;
        if (this.commandesEnCoursIds.length >= nbMax) {
            throw new Error(`Le livreur ${this.nom} a déjà atteint sa limite de livraisons (${nbMax})`);
        }
        if (this.commandesEnCoursIds.length > 0 && this.currentRestaurantId && this.currentRestaurantId !== restaurantId) {
            throw new Error(`En tant qu'expert, vous ne pouvez cumuler des commandes que du même restaurant.`);
        }
        this.statut = StatutLivreur_1.StatutLivreur.EN_LIVRAISON;
        this.commandesEnCoursIds.push(commandeId);
        this.currentRestaurantId = restaurantId;
    }
    terminerLivraison(commandeId, gains) {
        this.commandesEnCoursIds = this.commandesEnCoursIds.filter(id => id !== commandeId);
        this.portefeuille = this.portefeuille.ajouter(gains);
        if (this.commandesEnCoursIds.length === 0) {
            this.statut = StatutLivreur_1.StatutLivreur.DISPONIBLE;
            this.currentRestaurantId = undefined;
        }
    }
    estDisponible(restaurantId) {
        if (this.statut === StatutLivreur_1.StatutLivreur.INDISPONIBLE)
            return false;
        if (this.commandesEnCoursIds.length === 0)
            return true;
        const nbMax = this.estExpert ? 2 : 1;
        if (this.commandesEnCoursIds.length >= nbMax)
            return false;
        // Si déjà 1 commande, on n'en accepte une 2ème que si c'est le même restaurant
        if (restaurantId && this.currentRestaurantId && this.currentRestaurantId !== restaurantId) {
            return false;
        }
        return true;
    }
    getCurrentRestaurantId() { return this.currentRestaurantId; }
    getStatut() { return this.statut; }
    getPortefeuille() { return this.portefeuille; }
    getCommandesEnCoursIds() { return this.commandesEnCoursIds; }
    getPropositionsIds() { return this.propositionsIds; }
    recevoirProposition(commandeId) {
        if (!this.propositionsIds.includes(commandeId)) {
            this.propositionsIds.push(commandeId);
        }
    }
    accepterProposition(commandeId, restaurantId) {
        if (!this.propositionsIds.includes(commandeId)) {
            throw new Error("Proposition non trouvée");
        }
        this.propositionsIds = this.propositionsIds.filter(id => id !== commandeId);
        this.prendreEnCharge(commandeId, restaurantId);
    }
    refuserProposition(commandeId) {
        this.propositionsIds = this.propositionsIds.filter(id => id !== commandeId);
    }
}
exports.Livreur = Livreur;
//# sourceMappingURL=Livreur.js.map