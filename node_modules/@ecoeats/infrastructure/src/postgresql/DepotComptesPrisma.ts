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
      },
      create: {
        id: compte.id,
        email: compte.email,
        motDePasseHache: compte.motDePasseHache,
        role: compte.role,
        profilId: compte.profilId,
      },
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
      row.profilId
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
      row.profilId
    );
  }
}
