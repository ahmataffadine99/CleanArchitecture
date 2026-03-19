"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commande = void 0;
const Money_1 = require("../value-objects/Money");
const StatutCommande_1 = require("../value-objects/StatutCommande");
const TransitionStatutInvalideError_1 = require("../errors/TransitionStatutInvalideError");
class Commande {
    id;
    clientId;
    restaurantId;
    articles;
    prixPlats;
    fraisLivraison;
    fraisService;
    adresseLivraison;
    reduction;
    statut = StatutCommande_1.StatutCommande.EN_ATTENTE;
    tempsPreparationEstime = null; // en minutes
    livreurId = null;
    creeLe;
    constructor(id, clientId, restaurantId, articles, prixPlats, fraisLivraison, fraisService, adresseLivraison, reduction = Money_1.Money.zero()) {
        this.id = id;
        this.clientId = clientId;
        this.restaurantId = restaurantId;
        this.articles = articles;
        this.prixPlats = prixPlats;
        this.fraisLivraison = fraisLivraison;
        this.fraisService = fraisService;
        this.adresseLivraison = adresseLivraison;
        this.reduction = reduction;
        this.creeLe = new Date();
    }
    changerStatut(nouveauStatut) {
        if (!(0, StatutCommande_1.transitionAutorisee)(this.statut, nouveauStatut)) {
            throw new TransitionStatutInvalideError_1.TransitionStatutInvalideError(this.statut, nouveauStatut);
        }
        this.statut = nouveauStatut;
    }
    accepter(tempsPreparation) {
        this.changerStatut(StatutCommande_1.StatutCommande.ACCEPTEE);
        this.tempsPreparationEstime = tempsPreparation;
        this.changerStatut(StatutCommande_1.StatutCommande.EN_PREPARATION);
    }
    marquerPrete() {
        this.changerStatut(StatutCommande_1.StatutCommande.PRETE);
    }
    assignerLivreur(livreurId) {
        this.livreurId = livreurId;
        this.changerStatut(StatutCommande_1.StatutCommande.EN_LIVRAISON);
    }
    marquerLivree() {
        this.changerStatut(StatutCommande_1.StatutCommande.LIVREE);
    }
    prixTotal() {
        return this.prixPlats.ajouter(this.fraisLivraison).ajouter(this.fraisService).soustraire(this.reduction);
    }
    getStatut() {
        return this.statut;
    }
    getArticles() {
        return this.articles;
    }
    getPrixPlats() { return this.prixPlats; }
    getFraisLivraison() { return this.fraisLivraison; }
    getFraisService() { return this.fraisService; }
    getReduction() { return this.reduction; }
    getLivreurId() { return this.livreurId; }
    getTempsPreparation() { return this.tempsPreparationEstime; }
    getCreeLe() { return this.creeLe; }
    getAdresseLivraison() { return this.adresseLivraison; }
}
exports.Commande = Commande;
//# sourceMappingURL=Commande.js.map