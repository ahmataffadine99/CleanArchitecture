"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant = void 0;
class Restaurant {
    id;
    nom;
    adresse;
    position;
    proprietaireId;
    imageUrl;
    constructor(id, nom, adresse, position, proprietaireId, imageUrl = null) {
        this.id = id;
        this.nom = nom;
        this.adresse = adresse;
        this.position = position;
        this.proprietaireId = proprietaireId;
        this.imageUrl = imageUrl;
    }
}
exports.Restaurant = Restaurant;
//# sourceMappingURL=Restaurant.js.map