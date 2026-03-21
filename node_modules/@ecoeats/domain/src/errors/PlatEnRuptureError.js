"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatEnRuptureError = void 0;
const ErreurMetier_1 = require("./ErreurMetier");
class PlatEnRuptureError extends ErreurMetier_1.ErreurMetier {
    constructor(platId) {
        super("PLAT_EN_RUPTURE", `Le plat ${platId} n'est plus disponible (stock épuisé).`);
        this.platId = platId;
    }
    platId;
}
exports.PlatEnRuptureError = PlatEnRuptureError;
//# sourceMappingURL=PlatEnRuptureError.js.map