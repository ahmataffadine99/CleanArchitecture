import { PrismaClient } from "@prisma/client";
import { Client } from "@ecoeats/domain";
import { ClientIntrouvableError } from "@ecoeats/domain";
import { DepotClients } from "@ecoeats/application";

export class DepotClientsPrisma implements DepotClients {
  constructor(private readonly prisma: PrismaClient) {}

  async sauvegarder(client: Client): Promise<void> {
    await this.prisma.client.upsert({
      where: { id: client.id },
      update: { 
        nom: client.nom, 
        email: client.email, 
        adresse: client.adresse,
        telephone: client.telephone,
        pointsFidelite: client.getPointsFidelite()
      },
      create: {
        id: client.id,
        nom: client.nom,
        email: client.email,
        adresse: client.adresse,
        telephone: client.telephone,
        pointsFidelite: client.getPointsFidelite()
      },
    });
  }

  async trouverParId(id: string): Promise<Client | null> {
    const row = await this.prisma.client.findUnique({ where: { id } });
    if (!row) return null;
    return new Client(row.id, row.nom, row.email, row.adresse, row.telephone ?? undefined, (row as any).pointsFidelite ?? 0);
  }

  async mettreAJour(id: string, data: { nom?: string; email?: string; telephone?: string }): Promise<void> {
    await this.prisma.client.update({
      where: { id },
      data: {
        ...(data.nom && { nom: data.nom }),
        ...(data.email && { email: data.email }),
        ...(data.telephone && { telephone: data.telephone }),
      }
    });
  }
}
