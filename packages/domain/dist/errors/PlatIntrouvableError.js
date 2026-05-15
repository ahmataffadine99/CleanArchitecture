"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatIntrouvableError = void 0;
const ErreurMetier_1 = require("./ErreurMetier");
class PlatIntrouvableError extends ErreurMetier_1.ErreurMetier {
    constructor(platId) {
        super("PLAT_INTROUVABLE", `Plat introuvable : ${platId}`);
        this.platId = platId;
    }
    platId;
}
exports.PlatIntrouvableError = PlatIntrouvableError;