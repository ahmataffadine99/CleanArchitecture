import { TicketSupport, MessageTicket } from "@ecoeats/domain";
import { DepotTickets } from "@ecoeats/application";

export class DepotTicketsEnMemoire implements DepotTickets {
  private readonly tickets = new Map<string, TicketSupport>();
  private readonly messages = new Map<string, MessageTicket[]>();

  async sauvegarderTicket(ticket: TicketSupport): Promise<void> {
    this.tickets.set(ticket.id, ticket);
  }

  async trouverTicketParId(id: string): Promise<TicketSupport | null> {
    return this.tickets.get(id) || null;
  }

  async listerTickets(): Promise<TicketSupport[]> {
    return Array.from(this.tickets.values());
  }

  async listerTicketsParAuteur(auteurId: string): Promise<TicketSupport[]> {
    return Array.from(this.tickets.values()).filter(t => t.auteurId === auteurId);
  }

  async marquerCommeLu(id: string): Promise<void> {
    const ticket = this.tickets.get(id);
    if (ticket) {
      this.tickets.set(id, new TicketSupport(
        ticket.id,
        ticket.auteurId,
        ticket.titre,
        ticket.statut,
        ticket.creeLe,
        ticket.messages,
        true,
        ticket.auteurNom,
        ticket.auteurRole
      ));
    }
  }

  async sauvegarderMessage(message: MessageTicket): Promise<void> {
    const ticketMsgs = this.messages.get(message.ticketId) || [];
    ticketMsgs.push(message);
    this.messages.set(message.ticketId, ticketMsgs);
  }
}
