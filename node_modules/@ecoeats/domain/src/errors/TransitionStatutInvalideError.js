"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionStatutInvalideError = void 0;
const ErreurMetier_1 = require("./ErreurMetier");
class TransitionStatutInvalideError extends ErreurMetier_1.ErreurMetier {
    constructor(depuis, vers) {
        super("TRANSITION_STATUT_INVALIDE", `Impossible de passer du statut "${depuis}" vers "${vers}".`);
    }
}
exports.TransitionStatutInvalideError = TransitionStatutInvalideError;
//# sourceMappingURL=TransitionStatutInvalideError.js.map