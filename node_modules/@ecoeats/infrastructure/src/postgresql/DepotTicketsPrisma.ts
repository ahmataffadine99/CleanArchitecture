import { PrismaClient } from "@prisma/client";
import { TicketSupport, MessageTicket, StatutTicket } from "@ecoeats/domain";
import { DepotTickets } from "@ecoeats/application";

export class DepotTicketsPrisma implements DepotTickets {
  constructor(private readonly prisma: PrismaClient) {}

  async sauvegarderTicket(ticket: TicketSupport): Promise<void> {
    await (this.prisma as any).ticketSupport.upsert({
      where: { id: ticket.id },
      update: {
        titre: ticket.titre,
        statut: ticket.statut,
      },
      create: {
        id: ticket.id,
        auteurId: ticket.auteurId,
        titre: ticket.titre,
        statut: ticket.statut,
        creeLe: ticket.creeLe,
      },
    });

    for (const msg of ticket.messages) {
      await this.sauvegarderMessage(msg);
    }
  }

  async trouverTicketParId(id: string): Promise<TicketSupport | null> {
    const row = await (this.prisma as any).ticketSupport.findUnique({
      where: { id },
      include: { messages: { orderBy: { envoyeLe: "asc" } } },
    });

    if (!row) return null;

    return new TicketSupport(
      row.id,
      row.auteurId,
      row.titre,
      row.statut as StatutTicket,
      row.creeLe,
      (row.messages as any[]).map(
        (m) =>
          new MessageTicket(
            m.id,
            m.ticketId,
            m.auteurId,
            m.contenu,
            m.estAdmin,
            m.envoyeLe
          )
      )
    );
  }

  async listerTickets(): Promise<TicketSupport[]> {
    const rows = await (this.prisma as any).ticketSupport.findMany({
      include: { messages: { orderBy: { envoyeLe: "asc" } } },
      orderBy: { creeLe: "desc" },
    });

    const tickets = [];
    for (const row of rows) {
      // Fetch author details
      const compte = await (this.prisma as any).compteUtilisateur.findFirst({
        where: { profilId: row.auteurId }
      });
      const role = compte?.role;
      let nom = "Inconnu";

      if (role === "CLIENT") {
        const p = await (this.prisma as any).client.findUnique({ where: { id: row.auteurId } });
        nom = p?.nom || nom;
      } else if (role === "RESTAURATEUR") {
        const p = await (this.prisma as any).restaurant.findUnique({ where: { id: row.auteurId } });
        nom = p?.nom || nom;
      } else if (role === "LIVREUR") {
        const p = await (this.prisma as any).livreur.findUnique({ where: { id: row.auteurId } });
        nom = p?.nom || nom;
      }

      tickets.push(new TicketSupport(
        row.id,
        row.auteurId,
        row.titre,
        row.statut as StatutTicket,
        row.creeLe,
        (row.messages as any[]).map(
          (m) =>
            new MessageTicket(
              m.id,
              m.ticketId,
              m.auteurId,
              m.contenu,
              m.estAdmin,
              m.envoyeLe
            )
        ),
        nom,
        role
      ));
    }
    return tickets;
  }

  async listerTicketsParAuteur(auteurId: string): Promise<TicketSupport[]> {
    const rows = await (this.prisma as any).ticketSupport.findMany({
      where: { auteurId },
      include: { messages: { orderBy: { envoyeLe: "asc" } } },
      orderBy: { creeLe: "desc" },
    });

    return (rows as any[]).map(
      (row) =>
        new TicketSupport(
          row.id,
          row.auteurId,
          row.titre,
          row.statut as StatutTicket,
          row.creeLe,
          (row.messages as any[]).map(
            (m) =>
              new MessageTicket(
                m.id,
                m.ticketId,
                m.auteurId,
                m.contenu,
                m.estAdmin,
                m.envoyeLe
              )
          )
        )
    );
  }

  async sauvegarderMessage(message: MessageTicket): Promise<void> {
    await (this.prisma as any).messageTicket.upsert({
      where: { id: message.id },
      update: {
        contenu: message.contenu,
      },
      create: {
        id: message.id,
        ticketId: message.ticketId,
        auteurId: message.auteurId,
        contenu: message.contenu,
        estAdmin: message.estAdmin,
        envoyeLe: message.envoyeLe,
      },
    });
  }
}
