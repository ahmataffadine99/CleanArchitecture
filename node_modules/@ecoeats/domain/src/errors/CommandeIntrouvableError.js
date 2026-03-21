"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandeIntrouvableError = void 0;
const ErreurMetier_1 = require("./ErreurMetier");
class CommandeIntrouvableError extends ErreurMetier_1.ErreurMetier {
    constructor(commandeId) {
        super("COMMANDE_INTROUVABLE", `Aucune commande trouvée avec l'identifiant : ${commandeId}`);
        this.commandeId = commandeId;
    }
    commandeId;
}
exports.CommandeIntrouvableError = CommandeIntrouvableError;
//# sourceMappingURL=CommandeIntrouvableError.js.map