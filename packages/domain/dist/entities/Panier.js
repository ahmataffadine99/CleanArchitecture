"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Panier = void 0;
const Money_1 = require("../value-objects/Money");
const PanierConflitRestaurantError_1 = require("../errors/PanierConflitRestaurantError");
const PlatEnRuptureError_1 = require("../errors/PlatEnRuptureError");
// Règle métier : un panier ne peut contenir que des articles d'un seul restaurant
class Panier {
    clientId;
    articles = [];
    restaurantIdActuel = null;
    constructor(clientId) {
        this.clientId = clientId;
    }
    ajouterArticle(article) {
        if (this.restaurantIdActuel && this.restaurantIdActuel !== article.restaurantId) {
            throw new PanierConflitRestaurantError_1.PanierConflitRestaurantError(this.restaurantIdActuel, article.restaurantId);
        }
        if (article.quantite <= 0) {
            throw new PlatEnRuptureError_1.PlatEnRuptureError(article.menuItemId);
        }
        this.restaurantIdActuel = article.restaurantId;
        const existant = this.articles.find(a => a.menuItemId === article.menuItemId);
        if (existant) {
            const index = this.articles.indexOf(existant);
            this.articles[index] = existant.avecQuantite(existant.quantite + article.quantite);
        }
        else {
            this.articles.push(article);
        }
    }
    retirerArticle(platId) {
        const existant = this.articles.find(a => a.menuItemId === platId);
        if (!existant)
            return;
        if (existant.quantite > 1) {
            const index = this.articles.indexOf(existant);
            this.articles[index] = existant.avecQuantite(existant.quantite - 1);
        }
        else {
            this.articles = this.articles.filter(a => a.menuItemId !== platId);
            if (this.articles.length === 0) {
                this.restaurantIdActuel = null;
            }
        }
    }
    vider() {
        this.articles = [];
        this.restaurantIdActuel = null;
    }
    getArticles() {
        return this.articles;
    }
    getRestaurantId() {
        return this.restaurantIdActuel;
    }
    estVide() {
        return this.articles.length === 0;
    }
    prixTotal() {
        return this.articles.reduce((total, article) => total.ajouter(article.prixTotal()), Money_1.Money.zero());
    }
}
exports.Panier = Panier;
//# sourceMappingURL=Panier.js.map