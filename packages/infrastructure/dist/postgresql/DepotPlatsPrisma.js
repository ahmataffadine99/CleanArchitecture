"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotPlatsPrisma = void 0;
const domain_1 = require("@ecoeats/domain");
const domain_2 = require("@ecoeats/domain");
class DepotPlatsPrisma {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sauvegarder(plat) {
        await this.prisma.platMenu.upsert({
            where: { id: plat.id },
            update: {
                nom: plat.nom,
                description: plat.description,
                prixCentimes: plat.prix.enCentimes(),
                allergenes: plat.allergenes,
                stockJournalier: plat.stockJournalier,
                imageUrl: plat.imageUrl,
                actif: plat.actif,
                categorie: plat.categorie,
            },
            create: {
                id: plat.id,
                nom: plat.nom,
                description: plat.description,
                prixCentimes: plat.prix.enCentimes(),
                allergenes: plat.allergenes,
                stockJournalier: plat.stockJournalier,
                restaurantId: plat.restaurantId,
                imageUrl: plat.imageUrl,
                actif: plat.actif,
                categorie: plat.categorie,
            },
        });
    }
    async trouverParId(id) {
        const row = await this.prisma.platMenu.findUnique({ where: { id } });
        if (!row)
            throw new domain_2.PlatIntrouvableError(id);
        return new domain_1.PlatMenu(row.id, row.nom, row.description, domain_1.Money.fromCentimes(row.prixCentimes), row.allergenes, row.stockJournalier, row.restaurantId, row.imageUrl, row.actif, row.categorie);
    }
    async trouverParRestaurant(restaurantId) {
        const rows = await this.prisma.platMenu.findMany({ where: { restaurantId } });
        return rows.map((r) => new domain_1.PlatMenu(r.id, r.nom, r.description, domain_1.Money.fromCentimes(r.prixCentimes), r.allergenes, r.stockJournalier, r.restaurantId, r.imageUrl, r.actif, r.categorie));
    }
    async supprimer(id) {
        await this.prisma.platMenu.delete({ where: { id } });
    }
}
exports.DepotPlatsPrisma = DepotPlatsPrisma;