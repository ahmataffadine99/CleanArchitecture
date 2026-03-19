"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailDejaUtiliseError = void 0;
const ErreurMetier_1 = require("./ErreurMetier");
class EmailDejaUtiliseError extends ErreurMetier_1.ErreurMetier {
    constructor(email) {
        super("EMAIL_DEJA_UTILISE", `L'email "${email}" est déjà associé à un compte.`);
    }
}
exports.EmailDejaUtiliseError = EmailDejaUtiliseError;
//# sourceMappingURL=EmailDejaUtiliseError.js.map