"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotComptesPrisma = void 0;
const domain_1 = require("@ecoeats/domain");
class DepotComptesPrisma {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sauvegarder(compte) {
        await this.prisma.compteUtilisateur.upsert({
            where: { id: compte.id },
            update: {
                email: compte.email,
                motDePasseHache: compte.motDePasseHache,
                role: compte.role,
                profilId: compte.profilId,
            },
            create: {
                id: compte.id,
                email: compte.email,
                motDePasseHache: compte.motDePasseHache,
                role: compte.role,
                profilId: compte.profilId,
            },
        });
    }
    async trouverParEmail(email) {
        const row = await this.prisma.compteUtilisateur.findUnique({ where: { email } });
        if (!row)
            return null;
        return new domain_1.CompteUtilisateur(row.id, row.email, row.motDePasseHache, row.role, row.profilId);
    }
    async trouverParId(id) {
        const row = await this.prisma.compteUtilisateur.findUnique({ where: { id } });
        if (!row)
            return null;
        return new domain_1.CompteUtilisateur(row.id, row.email, row.motDePasseHache, row.role, row.profilId);
    }
}
exports.DepotComptesPrisma = DepotComptesPrisma;
//# sourceMappingURL=DepotComptesPrisma.js.map