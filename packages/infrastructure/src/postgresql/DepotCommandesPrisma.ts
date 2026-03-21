import { PrismaClient } from "@prisma/client";
import { Commande, ArticlePanier, Money, StatutCommande, Coordonnees } from "@ecoeats/domain";
import { CommandeIntrouvableError } from "@ecoeats/domain";
import { DepotCommandes } from "@ecoeats/application";

export class DepotCommandesPrisma implements DepotCommandes {
  constructor(private readonly prisma: PrismaClient) {}

  async sauvegarder(commande: Commande): Promise<void> {
    // On vérifie si la commande existe déjà
    const existe = await this.prisma.commande.findUnique({
      where: { id: commande.id },
    });

    if (existe) {
      // Mise à jour seulement des champs qui changent (statut, livreur, tempsPrepa)
      await this.prisma.commande.update({
        where: { id: commande.id },
        data: {
          statut: commande.getStatut(),
          livreurId: commande.getLivreurId(),
          tempsPreparation: commande.getTempsPreparation(),
          latitudeLivraison: commande.getPositionLivraison().latitude,
          longitudeLivraison: commande.getPositionLivraison().longitude,
        },
      });
    } else {
      // Création initiale avec tous les articles
      await this.prisma.commande.create({
        data: {
          id: commande.id,
          clientId: commande.clientId,
          restaurantId: commande.restaurantId,
          statut: commande.getStatut(),
          prixPlatsCentimes: commande.getPrixPlats().enCentimes(),
          fraisLivCentimes: commande.getFraisLivraison().enCentimes(),
          fraisServiceCentimes: commande.getFraisService().enCentimes(),
          reductionCentimes: commande.getReduction().enCentimes(),
          adresseLivraison: commande.getAdresseLivraison(),
          latitudeLivraison: commande.getPositionLivraison().latitude,
          longitudeLivraison: commande.getPositionLivraison().longitude,
          articles: {
            create: commande.getArticles().map((a) => ({
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
    return rows.map((r) => this.reconstruire(r));
  }

  async trouverParClient(clientId: string): Promise<Commande[]> {
    const rows = await this.prisma.commande.findMany({
      where: { clientId },
      include: { articles: true },
    });
    return rows.map((r) => this.reconstruire(r));
  }

  async trouverParLivreur(livreurId: string): Promise<Commande[]> {
    const rows = await this.prisma.commande.findMany({
      where: { livreurId },
      include: { articles: true },
      orderBy: { creeLe: 'desc' }
    });
    return rows.map((r) => this.reconstruire(r));
  }

  async trouverTout(): Promise<Commande[]> {
    const rows = await this.prisma.commande.findMany({
      include: { articles: true },
    });
    return rows.map((r) => this.reconstruire(r));
  }

  async trouverCommandesSansLivreur(): Promise<Commande[]> {
    const rows = await this.prisma.commande.findMany({
      where: {
        statut: { in: [StatutCommande.EN_PREPARATION, StatutCommande.PRETE] },
        livreurId: null,
      },
      include: { articles: true },
    });
    return rows.map((r) => this.reconstruire(r));
  }

  private reconstruire(row: any): Commande {
    const articles = (row.articles ?? []).map(
      (a: any) =>
        new ArticlePanier(
          a.menuItemId,
          a.nom,
          Money.fromCentimes(a.prixCentimes),
          a.quantite,
          a.restaurantId
        )
    );

    const commande = new Commande(
      row.id,
      row.clientId,
      row.restaurantId,
      articles,
      Money.fromCentimes(row.prixPlatsCentimes),
      Money.fromCentimes(row.fraisLivCentimes),
      Money.fromCentimes(row.fraisServiceCentimes),
      row.adresseLivraison,
      new Coordonnees(row.latitudeLivraison || 48.8566, row.longitudeLivraison || 2.3522),
      Money.fromCentimes(row.reductionCentimes ?? 0),
      row.creeLe
    );

    // Restaurer le statut via la machine à états (ceci ne restaure pas le temps de préparation)
    const transitions: StatutCommande[] = this.retrouverTransitions(row.statut as StatutCommande);
    for (const t of transitions) {
      try { commande.changerStatut(t); } catch (_) {}
    }

    // Restaurer le temps de préparation s'il est présent
    if (row.tempsPreparation !== null && row.tempsPreparation !== undefined) {
      commande.restaurerTempsPreparation(row.tempsPreparation);
    }

    // Restaurer le livreur assigné
    if (row.livreurId) {
      commande.assignerLivreur(row.livreurId);
    }

    return commande;
  }

  /**
   * Retrouve la suite minimale de transitions pour passer de EN_ATTENTE au statut cible.
   * Respecte strictement la machine à états du Domain.
   */
  private retrouverTransitions(statut: StatutCommande): StatutCommande[] {
    const chemin: Record<StatutCommande, StatutCommande[]> = {
      [StatutCommande.EN_ATTENTE]:    [],
      [StatutCommande.PAYEE]:         [StatutCommande.PAYEE],
      [StatutCommande.ACCEPTEE]:      [StatutCommande.PAYEE, StatutCommande.ACCEPTEE],
      [StatutCommande.EN_PREPARATION]:[StatutCommande.PAYEE, StatutCommande.ACCEPTEE, StatutCommande.EN_PREPARATION],
      [StatutCommande.PRETE]:         [StatutCommande.PAYEE, StatutCommande.ACCEPTEE, StatutCommande.EN_PREPARATION, StatutCommande.PRETE],
      [StatutCommande.EN_LIVRAISON]:  [StatutCommande.PAYEE, StatutCommande.ACCEPTEE, StatutCommande.EN_PREPARATION, StatutCommande.PRETE, StatutCommande.EN_LIVRAISON],
      [StatutCommande.LIVREE]:        [StatutCommande.PAYEE, StatutCommande.ACCEPTEE, StatutCommande.EN_PREPARATION, StatutCommande.PRETE, StatutCommande.EN_LIVRAISON, StatutCommande.LIVREE],
      [StatutCommande.REFUSEE]:       [StatutCommande.PAYEE, StatutCommande.REFUSEE],
    };
    return chemin[statut] ?? [];
  }
}
