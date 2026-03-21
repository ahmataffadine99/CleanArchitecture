"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotCommandesPrisma = void 0;
const domain_1 = require("@ecoeats/domain");
const domain_2 = require("@ecoeats/domain");
class DepotCommandesPrisma {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sauvegarder(commande) {
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
        }
        else {
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
    async trouverParId(id) {
        const row = await this.prisma.commande.findUnique({
            where: { id },
            include: { articles: true },
        });
        if (!row)
            throw new domain_2.CommandeIntrouvableError(id);
        return this.reconstruire(row);
    }
    async trouverParRestaurant(restaurantId) {
        const rows = await this.prisma.commande.findMany({
            where: { restaurantId },
            include: { articles: true },
        });
        return rows.map((r) => this.reconstruire(r));
    }
    async trouverParClient(clientId) {
        const rows = await this.prisma.commande.findMany({
            where: { clientId },
            include: { articles: true },
        });
        return rows.map((r) => this.reconstruire(r));
    }
    async trouverParLivreur(livreurId) {
        const rows = await this.prisma.commande.findMany({
            where: { livreurId },
            include: { articles: true },
            orderBy: { creeLe: 'desc' }
        });
        return rows.map((r) => this.reconstruire(r));
    }
    async trouverTout() {
        const rows = await this.prisma.commande.findMany({
            include: { articles: true },
        });
        return rows.map((r) => this.reconstruire(r));
    }
    async trouverCommandesSansLivreur() {
        const rows = await this.prisma.commande.findMany({
            where: {
                statut: { in: [domain_1.StatutCommande.EN_PREPARATION, domain_1.StatutCommande.PRETE] },
                livreurId: null,
            },
            include: { articles: true },
        });
        return rows.map((r) => this.reconstruire(r));
    }
    reconstruire(row) {
        const articles = (row.articles ?? []).map((a) => new domain_1.ArticlePanier(a.menuItemId, a.nom, domain_1.Money.fromCentimes(a.prixCentimes), a.quantite, a.restaurantId));
        const commande = new domain_1.Commande(row.id, row.clientId, row.restaurantId, articles, domain_1.Money.fromCentimes(row.prixPlatsCentimes), domain_1.Money.fromCentimes(row.fraisLivCentimes), domain_1.Money.fromCentimes(row.fraisServiceCentimes), row.adresseLivraison, new domain_1.Coordonnees(row.latitudeLivraison || 48.8566, row.longitudeLivraison || 2.3522), domain_1.Money.fromCentimes(row.reductionCentimes ?? 0), row.creeLe);
        // Restaurer le statut via la machine à états (ceci ne restaure pas le temps de préparation)
        const transitions = this.retrouverTransitions(row.statut);
        for (const t of transitions) {
            try {
                commande.changerStatut(t);
            }
            catch (_) { }
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
    retrouverTransitions(statut) {
        const chemin = {
            [domain_1.StatutCommande.EN_ATTENTE]: [],
            [domain_1.StatutCommande.PAYEE]: [domain_1.StatutCommande.PAYEE],
            [domain_1.StatutCommande.ACCEPTEE]: [domain_1.StatutCommande.PAYEE, domain_1.StatutCommande.ACCEPTEE],
            [domain_1.StatutCommande.EN_PREPARATION]: [domain_1.StatutCommande.PAYEE, domain_1.StatutCommande.ACCEPTEE, domain_1.StatutCommande.EN_PREPARATION],
            [domain_1.StatutCommande.PRETE]: [domain_1.StatutCommande.PAYEE, domain_1.StatutCommande.ACCEPTEE, domain_1.StatutCommande.EN_PREPARATION, domain_1.StatutCommande.PRETE],
            [domain_1.StatutCommande.EN_LIVRAISON]: [domain_1.StatutCommande.PAYEE, domain_1.StatutCommande.ACCEPTEE, domain_1.StatutCommande.EN_PREPARATION, domain_1.StatutCommande.PRETE, domain_1.StatutCommande.EN_LIVRAISON],
            [domain_1.StatutCommande.LIVREE]: [domain_1.StatutCommande.PAYEE, domain_1.StatutCommande.ACCEPTEE, domain_1.StatutCommande.EN_PREPARATION, domain_1.StatutCommande.PRETE, domain_1.StatutCommande.EN_LIVRAISON, domain_1.StatutCommande.LIVREE],
            [domain_1.StatutCommande.REFUSEE]: [domain_1.StatutCommande.PAYEE, domain_1.StatutCommande.REFUSEE],
        };
        return chemin[statut] ?? [];
    }
}
exports.DepotCommandesPrisma = DepotCommandesPrisma;
//# sourceMappingURL=DepotCommandesPrisma.js.map