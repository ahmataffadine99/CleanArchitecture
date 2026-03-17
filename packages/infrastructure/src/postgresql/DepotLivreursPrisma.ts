import { PrismaClient } from "@prisma/client";
import { Livreur, Coordonnees, StatutLivreur } from "@ecoeats/domain";
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
      },
      create: {
        id: livreur.id,
        nom: livreur.nom,
        telephone: livreur.telephone,
        latitude: livreur.position.latitude,
        longitude: livreur.position.longitude,
        statut: livreur.getStatut(),
        portefeuilleCentimes: 0,
      },
    });
  }

  async trouverParId(id: string): Promise<Livreur> {
    const row = await this.prisma.livreur.findUnique({ where: { id } });
    if (!row) throw new Error(`Livreur introuvable : ${id}`);
    return this.reconstruire(row);
  }

  async listerDisponibles(): Promise<Livreur[]> {
    const rows = await this.prisma.livreur.findMany({
      where: { statut: StatutLivreur.DISPONIBLE },
    });
    return rows.map((r) => this.reconstruire(r));
  }

  private reconstruire(row: {
    id: string;
    nom: string;
    telephone: string;
    latitude: number;
    longitude: number;
    statut: string;
    portefeuilleCentimes: number;
  }): Livreur {
    const livreur = new Livreur(
      row.id,
      row.nom,
      new Coordonnees(row.latitude, row.longitude),
      row.telephone
    );
    // On restaure le statut depuis la base
    if (row.statut === StatutLivreur.DISPONIBLE) {
      livreur.seDeclarerDisponible();
    }
    return livreur;
  }
}
