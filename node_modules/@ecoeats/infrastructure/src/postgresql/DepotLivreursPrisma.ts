import { PrismaClient } from "@prisma/client";
import { Livreur, Coordonnees, StatutLivreur, Money } from "@ecoeats/domain";
import { DepotLivreurs } from "@ecoeats/application";

export class DepotLivreursPrisma implements DepotLivreurs {
  constructor(private readonly prisma: PrismaClient) {}

  async sauvegarder(livreur: Livreur): Promise<void> {
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
      },
    });
  }

  async trouverParId(id: string): Promise<Livreur> {
    const row = await this.prisma.livreur.findUnique({ where: { id } });
    if (!row) throw new Error(`Livreur introuvable : ${id}`);
    return this.reconstruire(row as any);
  }

  async listerDisponibles(): Promise<Livreur[]> {
    const rows = await this.prisma.livreur.findMany({
      where: { statut: StatutLivreur.DISPONIBLE },
    });
    return rows.map((r) => this.reconstruire(r as any));
  }

  async retirerPropositionDeTous(commandeId: string): Promise<void> {
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

  private reconstruire(row: any): Livreur {
    const livreur = new Livreur(
      row.id,
      row.nom,
      new Coordonnees(row.latitude, row.longitude),
      row.telephone,
      row.estExpert,
      Money.fromCentimes(row.portefeuilleCentimes),
      row.propositionsIds || []
    );

    // Restaurer le statut depuis la base
    const statut = row.statut as StatutLivreur;
    if (statut === StatutLivreur.DISPONIBLE) {
      livreur.seDeclarerDisponible();
    } else if (statut === StatutLivreur.EN_LIVRAISON) {
      // Pour EN_LIVRAISON, on doit ré-attacher les commandes
      livreur.seDeclarerDisponible(); // On le met dispo d'abord pour pouvoir charger
      for (const cmdId of (row.commandesEnCoursIds || [])) {
        try { livreur.prendreEnCharge(cmdId); } catch (_) {}
      }
    } else {
      livreur.seDeclarerIndisponible();
    }

    return livreur;
  }
}
