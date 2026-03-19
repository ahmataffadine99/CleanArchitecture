"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifiantsInvalidesError = void 0;
const ErreurMetier_1 = require("./ErreurMetier");
class IdentifiantsInvalidesError extends ErreurMetier_1.ErreurMetier {
    constructor() {
        super("IDENTIFIANTS_INVALIDES", "Email ou mot de passe incorrect.");
    }
}
exports.IdentifiantsInvalidesError = IdentifiantsInvalidesError;
//# sourceMappingURL=IdentifiantsInvalidesError.js.map