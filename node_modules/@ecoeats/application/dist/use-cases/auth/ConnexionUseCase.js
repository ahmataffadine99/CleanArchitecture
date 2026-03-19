"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnexionUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ConnexionUseCase {
    depotComptes;
    secretJwt;
    constructor(depotComptes, secretJwt) {
        this.depotComptes = depotComptes;
        this.secretJwt = secretJwt;
    }
    async executer(req) {
        // Trouver le compte par email
        const compte = await this.depotComptes.trouverParEmail(req.email);
        if (!compte)
            throw new domain_1.IdentifiantsInvalidesError();
        // Vérifier le mot de passe contre le hash
        const motDePasseValide = await bcrypt_1.default.compare(req.motDePasse, compte.motDePasseHache);
        if (!motDePasseValide)
            throw new domain_1.IdentifiantsInvalidesError();
        // Générer le token JWT avec les infos utiles
        const token = jsonwebtoken_1.default.sign({
            sub: compte.id,
            role: compte.role,
            profilId: compte.profilId,
            email: compte.email,
        }, this.secretJwt, { expiresIn: "24h" });
        return { token, role: compte.role, profilId: compte.profilId };
    }
}
exports.ConnexionUseCase = ConnexionUseCase;
//# sourceMappingURL=ConnexionUseCase.js.map