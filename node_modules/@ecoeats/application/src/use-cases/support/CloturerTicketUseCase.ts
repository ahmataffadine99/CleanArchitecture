import { DepotTickets } from "../../ports/DepotTickets";

export class CloturerTicketUseCase {
  constructor(private readonly depotTickets: DepotTickets) {}

  async executer(ticketId: string): Promise<void> {
    const ticket = await this.depotTickets.trouverTicketParId(ticketId);
    if (!ticket) throw new Error("Ticket introuvable.");

    const ticketClos = { ...ticket, statut: "CLOS" as const };
    await this.depotTickets.sauvegarderTicket(ticketClos);
  }
}
