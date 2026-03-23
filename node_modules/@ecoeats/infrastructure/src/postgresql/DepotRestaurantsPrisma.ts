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
        categories: restaurant.categories,
      },
      create: {
        id: restaurant.id,
        nom: restaurant.nom,
        adresse: restaurant.adresse,
        latitude: restaurant.position.latitude,
        longitude: restaurant.position.longitude,
        proprietaireId: restaurant.proprietaireId,
        imageUrl: restaurant.imageUrl,
        categories: restaurant.categories,
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
      row.categories,
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
      row.categories,
      row.imageUrl
    );
  }

  async rechercher(filtres: { latitude?: number; longitude?: number; rayonKm?: number; categorie?: string }): Promise<Restaurant[]> {
    const where: any = {};
    
    if (filtres.categorie && filtres.categorie !== 'all') {
      where.categories = { has: filtres.categorie };
    }

    let rows = await this.prisma.restaurant.findMany({ where });

    if (filtres.latitude !== undefined && filtres.longitude !== undefined && filtres.rayonKm !== undefined) {
        rows = rows.filter(r => {
            const dist = this.calculerDistance(filtres.latitude!, filtres.longitude!, r.latitude, r.longitude);
            return dist <= filtres.rayonKm!;
        });
    }

    return rows.map(r => this.mapToEntity(r));
  }

  private calculerDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
