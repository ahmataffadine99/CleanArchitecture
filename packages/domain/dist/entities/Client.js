"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
class Client {
    id;
    nom;
    email;
    adresse;
    telephone;
    pointsFidelite;
    constructor(id, nom, email, adresse, telephone, pointsFidelite = 0) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.adresse = adresse;
        this.telephone = telephone;
        this.pointsFidelite = pointsFidelite;
    }
    getPointsFidelite() {
        return this.pointsFidelite;
    }
    crediterPoints(points) {
        if (points > 0)
            this.pointsFidelite += points;
    }
}
exports.Client = Client;