import { PrismaClient } from "@prisma/client";
import { Client } from "@ecoeats/domain";
import { ClientIntrouvableError } from "@ecoeats/domain";
import { DepotClients } from "@ecoeats/application";

export class DepotClientsPrisma implements DepotClients {
  constructor(private readonly prisma: PrismaClient) {}

  async sauvegarder(client: Client): Promise<void> {
    await this.prisma.client.upsert({
      where: { id: client.id },
      update: { nom: client.nom, email: client.email, adresse: client.adresse },
      create: {
        id: client.id,
        nom: client.nom,
        email: client.email,
        adresse: client.adresse,
      },
    });
  }

  async trouverParId(id: string): Promise<Client> {
    const row = await this.prisma.client.findUnique({ where: { id } });
    if (!row) throw new ClientIntrouvableError(id);
    return new Client(row.id, row.nom, row.email, row.adresse);
  }
}
