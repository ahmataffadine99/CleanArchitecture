import { PrismaClient } from "@prisma/client";
import { Avis } from "@ecoeats/domain";
import { DepotAvis } from "@ecoeats/application";

export class DepotAvisPrisma implements DepotAvis {
  constructor(private readonly prisma: PrismaClient) {}

  async sauvegarder(avis: Avis): Promise<void> {
    await this.prisma.avisLivreur.upsert({
      where: { commandeId: avis.commandeId },
      update: {
        note: avis.note,
        commentaire: avis.commentaire,
      },
      create: {
        id: avis.id,
        commandeId: avis.commandeId,
        livreurId: avis.livreurId,
        clientId: avis.clientId,
        note: avis.note,
        commentaire: avis.commentaire,
        creeLe: avis.creeLe
      }
    });
  }

  async trouverParLivreur(livreurId: string): Promise<Avis[]> {
    const rows = await this.prisma.avisLivreur.findMany({
      where: { livreurId },
      orderBy: { creeLe: 'desc' }
    });
    return rows.map(r => new Avis(r.id, r.commandeId, r.livreurId, r.clientId, r.note, r.commentaire, r.creeLe));
  }

  async trouverParCommande(commandeId: string): Promise<Avis | null> {
    const r = await this.prisma.avisLivreur.findUnique({ where: { commandeId } });
    if (!r) return null;
    return new Avis(r.id, r.commandeId, r.livreurId, r.clientId, r.note, r.commentaire, r.creeLe);
  }
}
