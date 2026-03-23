import { MessageTicket } from "@ecoeats/domain";
import { DepotTickets } from "../../ports/DepotTickets";
import { v4 as uuidv4 } from "uuid";

export class EnvoyerMessageTicketUseCase {
  constructor(private readonly depotTickets: DepotTickets) {}

  async executer(ticketId: string, auteurId: string, contenu: string, estAdmin: boolean): Promise<MessageTicket> {
    const ticket = await this.depotTickets.trouverTicketParId(ticketId);
    if (!ticket) throw new Error("Ticket introuvable.");
    if (ticket.statut === "CLOS") throw new Error("Impossible d'envoyer un message sur un ticket clos.");

    const message = new MessageTicket(
      uuidv4(),
      ticketId,
      auteurId,
      contenu,
      estAdmin,
      new Date()
    );

    await this.depotTickets.sauvegarderMessage(message);
    return message;
  }
}
