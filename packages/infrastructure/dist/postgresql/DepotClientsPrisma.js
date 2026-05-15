"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotClientsPrisma = void 0;
const domain_1 = require("@ecoeats/domain");
const domain_2 = require("@ecoeats/domain");
class DepotClientsPrisma {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sauvegarder(client) {
        await this.prisma.client.upsert({
            where: { id: client.id },
            update: {
                nom: client.nom,
                email: client.email,
                adresse: client.adresse,
                telephone: client.telephone,
                pointsFidelite: client.getPointsFidelite()
            },
            create: {
                id: client.id,
                nom: client.nom,
                email: client.email,
                adresse: client.adresse,
                telephone: client.telephone,
                pointsFidelite: client.getPointsFidelite()
            },
        });
    }
    async trouverParId(id) {
        const row = await this.prisma.client.findUnique({ where: { id } });
        if (!row)
            throw new domain_2.ClientIntrouvableError(id);
        return new domain_1.Client(row.id, row.nom, row.email, row.adresse, row.telephone ?? undefined, row.pointsFidelite ?? 0);
    }
}
exports.DepotClientsPrisma = DepotClientsPrisma;