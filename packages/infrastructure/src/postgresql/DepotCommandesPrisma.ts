import { PrismaClient } from "@prisma/client";
import { Commande, ArticlePanier, Money, StatutCommande } from "@ecoeats/domain";
import { CommandeIntrouvableError } from "@ecoeats/domain";
import { DepotCommandes } from "@ecoeats/application";

export class DepotCommandesPrisma implements DepotCommandes {
  constructor(private readonly prisma: PrismaClient) {}

  async sauvegarder(commande: Commande): Promise<void> {
    await this.prisma.commande.upsert({
      where: { id: commande.id },
      update: {
        statut: commande.getStatut(),
        livreurId: commande.getLivreurId(),
        tempsPreparation: commande.getTempsPreparation(),
      },
      create: {
        id: commande.id,
        clientId: commande.clientId,
        restaurantId: commande.restaurantId,
        statut: commande.getStatut(),
        prixPlatsCentimes: commande.getPrixPlats().enCentimes(),
        fraisLivCentimes: commande.getFraisLivraison().enCentimes(),
        fraisServiceCentimes: commande.getFraisService().enCentimes(),
        adresseLivraison: commande.getAdresseLivraison(),
        articles: {
          create: commande.getArticles().map(a => ({
            menuItemId: a.menuItemId,
            nom: a.nom,
            prixCentimes: a.prixSnapshot.enCentimes(),
            quantite: a.quantite,
            restaurantId: a.restaurantId,
          })),
        },
      },
    });
  }

  async trouverParId(id: string): Promise<Commande> {
    const row = await this.prisma.commande.findUnique({
      where: { id },
      include: { articles: true },
    });
    if (!row) throw new CommandeIntrouvableError(id);
    return this.reconstruire(row);
  }

  async trouverParRestaurant(restaurantId: string): Promise<Commande[]> {
    const rows = await this.prisma.commande.findMany({
      where: { restaurantId },
      include: { articles: true },
    });
    return rows.map(r => this.reconstruire(r));
  }

  async trouverParClient(clientId: string): Promise<Commande[]> {
    const rows = await this.prisma.commande.findMany({
      where: { clientId },
      include: { articles: true },
    });
    return rows.map(r => this.reconstruire(r));
  }

  private reconstruire(row: any): Commande {
    const articles = row.articles.map(
      (a: any) =>
        new ArticlePanier(
          a.menuItemId,
          a.nom,
          Money.fromCentimes(a.prixCentimes),
          a.quantite,
          a.restaurantId
        )
    );
    return new Commande(
      row.id,
      row.clientId,
      row.restaurantId,
      articles,
      Money.fromCentimes(row.prixPlatsCentimes),
      Money.fromCentimes(row.fraisLivCentimes),
      Money.fromCentimes(row.fraisServiceCentimes),
      row.adresseLivraison
    );
  }
}
