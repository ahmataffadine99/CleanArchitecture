"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompteUtilisateur = void 0;
class CompteUtilisateur {
    id;
    email;
    motDePasseHache;
    role;
    profilId;
    constructor(id, email, motDePasseHache, role, profilId // id du Client, Livreur ou Restaurant associé
    ) {
        this.id = id;
        this.email = email;
        this.motDePasseHache = motDePasseHache;
        this.role = role;
        this.profilId = profilId;
    }
}
exports.CompteUtilisateur = CompteUtilisateur;
//# sourceMappingURL=CompteUtilisateur.js.map