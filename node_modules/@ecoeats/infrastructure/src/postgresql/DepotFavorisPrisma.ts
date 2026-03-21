import { PrismaClient } from "@prisma/client";
import { DepotFavoris } from "@ecoeats/application";

export class DepotFavorisPrisma implements DepotFavoris {
  constructor(private readonly prisma: PrismaClient) {}

  async ajouterRestaurant(clientId: string, restaurantId: string): Promise<void> {
    await this.prisma.favoriRestaurant.upsert({
      where: { clientId_restaurantId: { clientId, restaurantId } },
      update: {},
      create: { clientId, restaurantId }
    });
  }

  async retirerRestaurant(clientId: string, restaurantId: string): Promise<void> {
    await this.prisma.favoriRestaurant.delete({
      where: { clientId_restaurantId: { clientId, restaurantId } }
    }).catch(() => {}); // Ignorer si déjà supprimé
  }

  async listerRestaurants(clientId: string): Promise<string[]> {
    const rows = await this.prisma.favoriRestaurant.findMany({ where: { clientId } });
    return rows.map(r => r.restaurantId);
  }

  async ajouterPlat(clientId: string, platId: string): Promise<void> {
    await this.prisma.favoriPlat.upsert({
      where: { clientId_platId: { clientId, platId } },
      update: {},
      create: { clientId, platId }
    });
  }

  async retirerPlat(clientId: string, platId: string): Promise<void> {
    await this.prisma.favoriPlat.delete({
      where: { clientId_platId: { clientId, platId } }
    }).catch(() => {});
  }

  async listerPlats(clientId: string): Promise<string[]> {
    const rows = await this.prisma.favoriPlat.findMany({ where: { clientId } });
    return rows.map(r => r.platId);
  }
}
