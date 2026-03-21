"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avis = void 0;
class Avis {
    id;
    commandeId;
    livreurId;
    clientId;
    note;
    commentaire;
    creeLe;
    constructor(id, commandeId, livreurId, clientId, note, // 1 à 5
    commentaire = null, creeLe = new Date()) {
        this.id = id;
        this.commandeId = commandeId;
        this.livreurId = livreurId;
        this.clientId = clientId;
        this.note = note;
        this.commentaire = commentaire;
        this.creeLe = creeLe;
        if (note < 1 || note > 5) {
            throw new Error("La note doit être comprise entre 1 et 5");
        }
    }
}
exports.Avis = Avis;
//# sourceMappingURL=Avis.js.map