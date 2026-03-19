import { PrismaClient } from "@prisma/client";
import { Restaurant } from "@ecoeats/domain";
import { Coordonnees } from "@ecoeats/domain";
import { RestaurantIntrouvableError } from "@ecoeats/domain";
import { DepotRestaurants } from "@ecoeats/application";

export class DepotRestaurantsPrisma implements DepotRestaurants {
  constructor(private readonly prisma: PrismaClient) {}

  async sauvegarder(restaurant: Restaurant): Promise<void> {
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

  async trouverParId(id: string): Promise<Restaurant> {
    const row = await this.prisma.restaurant.findUnique({ where: { id } });
    if (!row) throw new RestaurantIntrouvableError(id);
    return new Restaurant(
      row.id,
      row.nom,
      row.adresse,
      new Coordonnees(row.latitude, row.longitude),
      row.proprietaireId,
      row.imageUrl
    );
  }

  async listerTous(): Promise<Restaurant[]> {
    const rows = await this.prisma.restaurant.findMany();
    return rows.map(r => this.mapToEntity(r));
  }

  async trouverParProprietaireId(proprietaireId: string): Promise<Restaurant | null> {
    const row = await this.prisma.restaurant.findFirst({ where: { proprietaireId } });
    return row ? this.mapToEntity(row) : null;
  }

  private mapToEntity(row: any): Restaurant {
    return new Restaurant(
      row.id,
      row.nom,
      row.adresse,
      new Coordonnees(row.latitude, row.longitude),
      row.proprietaireId,
      row.imageUrl
    );
  }
}
