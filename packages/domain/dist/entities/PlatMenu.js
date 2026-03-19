"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatMenu = void 0;
class PlatMenu {
    id;
    nom;
    description;
    prix;
    allergenes;
    stockJournalier;
    restaurantId;
    imageUrl;
    actif;
    constructor(id, nom, description, prix, allergenes, stockJournalier, restaurantId, imageUrl = null, actif = true) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.prix = prix;
        this.allergenes = allergenes;
        this.stockJournalier = stockJournalier;
        this.restaurantId = restaurantId;
        this.imageUrl = imageUrl;
        this.actif = actif;
    }
    estDisponible() {
        return this.stockJournalier > 0;
    }
    diminuerStock(quantite = 1) {
        if (quantite > this.stockJournalier) {
            throw new Error(`Stock insuffisant pour "${this.nom}" (stock: ${this.stockJournalier})`);
        }
        this.stockJournalier -= quantite;
    }
    mettreAJour(infos) {
        if (infos.nom !== undefined)
            this.nom = infos.nom;
        if (infos.description !== undefined)
            this.description = infos.description;
        if (infos.prix !== undefined)
            this.prix = infos.prix;
        if (infos.allergenes !== undefined)
            this.allergenes = infos.allergenes;
        if (infos.stockJournalier !== undefined)
            this.stockJournalier = infos.stockJournalier;
        if (infos.imageUrl !== undefined)
            this.imageUrl = infos.imageUrl;
        if (infos.actif !== undefined)
            this.actif = infos.actif;
    }
}
exports.PlatMenu = PlatMenu;
//# sourceMappingURL=PlatMenu.js.map