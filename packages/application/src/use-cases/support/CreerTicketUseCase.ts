import { TicketSupport, MessageTicket } from "@ecoeats/domain";
import { DepotTickets } from "../../ports/DepotTickets";
import { v4 as uuidv4 } from "uuid";

export class CreerTicketUseCase {
  constructor(private readonly depotTickets: DepotTickets) {}

  async executer(auteurId: string, titre: string, messageInitial: string): Promise<TicketSupport> {
    const ticketId = uuidv4();
    const messageId = uuidv4();
    const maintenant = new Date();

    const premierMessage = new MessageTicket(
      messageId,
      ticketId,
      auteurId,
      messageInitial,
      false,
      maintenant
    );

    const ticket = new TicketSupport(
      ticketId,
      auteurId,
      titre,
      "OUVERT",
      maintenant,
      [premierMessage]
    );

    await this.depotTickets.sauvegarderTicket(ticket);
    return ticket;
  }
}
