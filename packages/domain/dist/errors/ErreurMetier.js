"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErreurMetier = void 0;
// Classe de base pour toutes les erreurs métier — permet de les distinguer des erreurs techniques
class ErreurMetier extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = this.constructor.name;
    }
}
exports.ErreurMetier = ErreurMetier;
//# sourceMappingURL=ErreurMetier.js.map