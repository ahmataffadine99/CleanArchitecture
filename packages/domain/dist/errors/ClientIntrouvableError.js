"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientIntrouvableError = void 0;
const ErreurMetier_1 = require("./ErreurMetier");
class ClientIntrouvableError extends ErreurMetier_1.ErreurMetier {
    constructor(clientId) {
        super("CLIENT_INTROUVABLE", `Client introuvable : ${clientId}`);
        this.clientId = clientId;
    }
    clientId;
}
exports.ClientIntrouvableError = ClientIntrouvableError;