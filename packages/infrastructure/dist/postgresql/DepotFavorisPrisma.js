"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotFavorisPrisma = void 0;
class DepotFavorisPrisma {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ajouterRestaurant(clientId, restaurantId) {
        await this.prisma.favoriRestaurant.upsert({
            where: { clientId_restaurantId: { clientId, restaurantId } },
            update: {},
            create: { clientId, restaurantId }
        });
    }
    async retirerRestaurant(clientId, restaurantId) {
        await this.prisma.favoriRestaurant.delete({
            where: { clientId_restaurantId: { clientId, restaurantId } }
        }).catch(() => { }); // Ignorer si déjà supprimé
    }
    async listerRestaurants(clientId) {
        const rows = await this.prisma.favoriRestaurant.findMany({ where: { clientId } });
        return rows.map(r => r.restaurantId);
    }
    async ajouterPlat(clientId, platId) {
        await this.prisma.favoriPlat.upsert({
            where: { clientId_platId: { clientId, platId } },
            update: {},
            create: { clientId, platId }
        });
    }
    async retirerPlat(clientId, platId) {
        await this.prisma.favoriPlat.delete({
            where: { clientId_platId: { clientId, platId } }
        }).catch(() => { });
    }
    async listerPlats(clientId) {
        const rows = await this.prisma.favoriPlat.findMany({ where: { clientId } });
        return rows.map(r => r.platId);
    }
}
exports.DepotFavorisPrisma = DepotFavorisPrisma;
//# sourceMappingURL=DepotFavorisPrisma.js.map