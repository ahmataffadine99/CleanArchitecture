import { PrismaClient } from "@prisma/client";
import { CompteUtilisateur, RoleUtilisateur } from "@ecoeats/domain";
import { DepotComptes } from "@ecoeats/application";

export class DepotComptesPrisma implements DepotComptes {
  constructor(private readonly prisma: PrismaClient) {}

  async sauvegarder(compte: CompteUtilisateur): Promise<void> {
    await this.prisma.compteUtilisateur.upsert({
      where: { id: compte.id },
      update: {
        email: compte.email,
        motDePasseHache: compte.motDePasseHache,
        role: compte.role,
        profilId: compte.profilId,
        estActif: (compte as any).estActif,
      } as any,
      create: {
        id: compte.id,
        email: compte.email,
        motDePasseHache: compte.motDePasseHache,
        role: compte.role,
        profilId: compte.profilId,
        estActif: (compte as any).estActif,
      } as any,
    });
  }

  async trouverParEmail(email: string): Promise<CompteUtilisateur | null> {
    const row = await this.prisma.compteUtilisateur.findUnique({ where: { email } });
    if (!row) return null;
    return new CompteUtilisateur(
      row.id,
      row.email,
      row.motDePasseHache,
      row.role as RoleUtilisateur,
      row.profilId,
      row.estActif ?? true,
      row.creeLe
    );
  }

  async trouverParId(id: string): Promise<CompteUtilisateur | null> {
    const row = await this.prisma.compteUtilisateur.findUnique({ where: { id } });
    if (!row) return null;
    return new CompteUtilisateur(
      row.id,
      row.email,
      row.motDePasseHache,
      row.role as RoleUtilisateur,
      row.profilId,
      row.estActif ?? true,
      row.creeLe
    );
  }

  async trouverTout(): Promise<CompteUtilisateur[]> {
    const rows = await this.prisma.compteUtilisateur.findMany();
    return rows.map(row => new CompteUtilisateur(
      row.id,
      row.email,
      row.motDePasseHache,
      row.role as RoleUtilisateur,
      row.profilId,
      row.estActif,
      row.creeLe
    ));
  }
}
