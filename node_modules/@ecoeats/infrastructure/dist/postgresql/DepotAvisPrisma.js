"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotAvisPrisma = void 0;
const domain_1 = require("@ecoeats/domain");
class DepotAvisPrisma {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sauvegarder(avis) {
        await this.prisma.avisLivreur.upsert({
            where: { commandeId: avis.commandeId },
            update: {
                note: avis.note,
                commentaire: avis.commentaire,
            },
            create: {
                id: avis.id,
                commandeId: avis.commandeId,
                livreurId: avis.livreurId,
                clientId: avis.clientId,
                note: avis.note,
                commentaire: avis.commentaire,
                creeLe: avis.creeLe
            }
        });
    }
    async trouverParLivreur(livreurId) {
        const rows = await this.prisma.avisLivreur.findMany({
            where: { livreurId },
            orderBy: { creeLe: 'desc' }
        });
        return rows.map(r => new domain_1.Avis(r.id, r.commandeId, r.livreurId, r.clientId, r.note, r.commentaire, r.creeLe));
    }
    async trouverParCommande(commandeId) {
        const r = await this.prisma.avisLivreur.findUnique({ where: { commandeId } });
        if (!r)
            return null;
        return new domain_1.Avis(r.id, r.commandeId, r.livreurId, r.clientId, r.note, r.commentaire, r.creeLe);
    }
}
exports.DepotAvisPrisma = DepotAvisPrisma;
//# sourceMappingURL=DepotAvisPrisma.js.map