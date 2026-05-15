"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotLivreursPrisma = void 0;
const domain_1 = require("@ecoeats/domain");
class DepotLivreursPrisma {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sauvegarder(livreur) {
        await this.prisma.livreur.upsert({
            where: { id: livreur.id },
            update: {
                statut: livreur.getStatut(),
                portefeuilleCentimes: livreur.getPortefeuille().enCentimes(),
                latitude: livreur.position.latitude,
                longitude: livreur.position.longitude,
                estExpert: livreur.estExpert,
                commandesEnCoursIds: livreur.getCommandesEnCoursIds(),
                propositionsIds: livreur.getPropositionsIds(),
                currentRestaurantId: livreur.getCurrentRestaurantId(),
            },
            create: {
                id: livreur.id,
                nom: livreur.nom,
                telephone: livreur.telephone,
                latitude: livreur.position.latitude,
                longitude: livreur.position.longitude,
                statut: livreur.getStatut(),
                portefeuilleCentimes: livreur.getPortefeuille().enCentimes(),
                estExpert: livreur.estExpert,
                commandesEnCoursIds: livreur.getCommandesEnCoursIds(),
                propositionsIds: livreur.getPropositionsIds(),
                currentRestaurantId: livreur.getCurrentRestaurantId(),
            },
        });
    }
    async trouverParId(id) {
        const row = await this.prisma.livreur.findUnique({ where: { id } });
        if (!row)
            throw new Error(`Livreur introuvable : ${id}`);
        return this.reconstruire(row);
    }
    async listerDisponibles() {
        const rows = await this.prisma.livreur.findMany({
            where: { statut: domain_1.StatutLivreur.DISPONIBLE },
        });
        return rows.map((r) => this.reconstruire(r));
    }
    async listerEligiblesPourRestaurant(restaurantId) {
        const rows = await this.prisma.livreur.findMany({
            where: {
                OR: [
                    { statut: domain_1.StatutLivreur.DISPONIBLE },
                    {
                        statut: domain_1.StatutLivreur.EN_LIVRAISON,
                        estExpert: true,
                        currentRestaurantId: restaurantId,
                    }
                ]
            }
        });
        return rows
            .map((r) => this.reconstruire(r))
            .filter(l => l.estDisponible(restaurantId));
    }
    async retirerPropositionDeTous(commandeId) {
        const livreursAvecProp = await this.prisma.livreur.findMany({
            where: {
                propositionsIds: {
                    has: commandeId
                }
            }
        });
        for (const row of livreursAvecProp) {
            const nouvellesProps = row.propositionsIds.filter(id => id !== commandeId);
            await this.prisma.livreur.update({
                where: { id: row.id },
                data: { propositionsIds: nouvellesProps }
            });
        }
    }
    reconstruire(row) {
        const livreur = new domain_1.Livreur(row.id, row.nom, new domain_1.Coordonnees(row.latitude, row.longitude), row.telephone, row.estExpert, domain_1.Money.fromCentimes(row.portefeuilleCentimes), row.propositionsIds || [], row.currentRestaurantId || undefined);
        const statut = row.statut;
        if (statut === domain_1.StatutLivreur.DISPONIBLE) {
            livreur.seDeclarerDisponible();
        }
        else if (statut === domain_1.StatutLivreur.EN_LIVRAISON) {
            livreur.seDeclarerDisponible();
            for (const cmdId of (row.commandesEnCoursIds || [])) {
                try {
                    livreur.prendreEnCharge(cmdId, row.currentRestaurantId || '');
                }
                catch (_) { }
            }
        }
        else {
            livreur.seDeclarerIndisponible();
        }
        return livreur;
    }
}
exports.DepotLivreursPrisma = DepotLivreursPrisma;