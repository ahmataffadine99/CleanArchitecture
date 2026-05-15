"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotRestaurantsPrisma = void 0;
const domain_1 = require("@ecoeats/domain");
const domain_2 = require("@ecoeats/domain");
const domain_3 = require("@ecoeats/domain");
class DepotRestaurantsPrisma {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sauvegarder(restaurant) {
        await this.prisma.restaurant.upsert({
            where: { id: restaurant.id },
            update: {
                nom: restaurant.nom,
                adresse: restaurant.adresse,
                latitude: restaurant.position.latitude,
                longitude: restaurant.position.longitude,
                imageUrl: restaurant.imageUrl,
            },
            create: {
                id: restaurant.id,
                nom: restaurant.nom,
                adresse: restaurant.adresse,
                latitude: restaurant.position.latitude,
                longitude: restaurant.position.longitude,
                proprietaireId: restaurant.proprietaireId,
                imageUrl: restaurant.imageUrl,
            },
        });
    }
    async trouverParId(id) {
        const row = await this.prisma.restaurant.findUnique({ where: { id } });
        if (!row)
            throw new domain_3.RestaurantIntrouvableError(id);
        return new domain_1.Restaurant(row.id, row.nom, row.adresse, new domain_2.Coordonnees(row.latitude, row.longitude), row.proprietaireId, row.imageUrl);
    }
    async listerTous() {
        const rows = await this.prisma.restaurant.findMany();
        return rows.map(r => this.mapToEntity(r));
    }
    async trouverParProprietaireId(proprietaireId) {
        const row = await this.prisma.restaurant.findFirst({ where: { proprietaireId } });
        return row ? this.mapToEntity(row) : null;
    }
    mapToEntity(row) {
        return new domain_1.Restaurant(row.id, row.nom, row.adresse, new domain_2.Coordonnees(row.latitude, row.longitude), row.proprietaireId, row.imageUrl);
    }
}
exports.DepotRestaurantsPrisma = DepotRestaurantsPrisma;