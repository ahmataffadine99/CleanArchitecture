import { DepotTickets } from "../../ports/DepotTickets";

export class MarquerTicketCommeLuUseCase {
  constructor(private readonly depotTickets: DepotTickets) {}

  async executer(ticketId: string): Promise<void> {
    const ticket = await this.depotTickets.trouverTicketParId(ticketId);
    if (!ticket) throw new Error("Ticket introuvable");
    await this.depotTickets.marquerCommeLu(ticketId);
  }
}
