"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlePanier = void 0;
// Représente un article dans le panier — snapshot du prix au moment de l'ajout
class ArticlePanier {
    menuItemId;
    nom;
    prixSnapshot;
    quantite;
    restaurantId;
    constructor(menuItemId, nom, prixSnapshot, quantite, restaurantId) {
        this.menuItemId = menuItemId;
        this.nom = nom;
        this.prixSnapshot = prixSnapshot;
        this.quantite = quantite;
        this.restaurantId = restaurantId;
        if (quantite <= 0) {
            throw new Error("La quantité doit être supérieure à 0");
        }
    }
    prixTotal() {
        return this.prixSnapshot.multiplier(this.quantite);
    }
    avecQuantite(nouvelleQuantite) {
        return new ArticlePanier(this.menuItemId, this.nom, this.prixSnapshot, nouvelleQuantite, this.restaurantId);
    }
}
exports.ArticlePanier = ArticlePanier;
//# sourceMappingURL=ArticlePanier.js.map