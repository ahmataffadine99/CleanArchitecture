"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErreurMetier = void 0;
class ErreurMetier extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = this.constructor.name;
    }
}
exports.ErreurMetier = ErreurMetier;