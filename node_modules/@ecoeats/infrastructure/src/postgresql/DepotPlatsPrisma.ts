import { PrismaClient } from "@prisma/client";
import { PlatMenu, Money } from "@ecoeats/domain";
import { PlatIntrouvableError } from "@ecoeats/domain";
import { DepotPlats } from "@ecoeats/application";

export class DepotPlatsPrisma implements DepotPlats {
  constructor(private readonly prisma: PrismaClient) {}

  async sauvegarder(plat: PlatMenu): Promise<void> {
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

  async trouverParId(id: string): Promise<PlatMenu> {
    const row = await this.prisma.platMenu.findUnique({ where: { id } });
    if (!row) throw new PlatIntrouvableError(id);
    return new PlatMenu(
      row.id,
      row.nom,
      row.description,
      Money.fromCentimes(row.prixCentimes),
      row.allergenes,
      row.stockJournalier,
      row.restaurantId,
      row.imageUrl,
      row.actif,
      row.categorie
    );
  }

  async trouverParRestaurant(restaurantId: string): Promise<PlatMenu[]> {
    const rows = await this.prisma.platMenu.findMany({ where: { restaurantId } });
    return rows.map(
      (r) =>
        new PlatMenu(
          r.id,
          r.nom,
          r.description,
          Money.fromCentimes(r.prixCentimes),
          r.allergenes,
          r.stockJournalier,
          r.restaurantId,
          r.imageUrl,
          r.actif,
          r.categorie
        )
    );
  }

  async supprimer(id: string): Promise<void> {
    await this.prisma.platMenu.delete({ where: { id } });
  }
}
