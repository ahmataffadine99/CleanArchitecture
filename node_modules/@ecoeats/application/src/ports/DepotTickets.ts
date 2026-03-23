import { TicketSupport, MessageTicket } from "@ecoeats/domain";

export interface DepotTickets {
  sauvegarderTicket(ticket: TicketSupport): Promise<void>;
  trouverTicketParId(id: string): Promise<TicketSupport | null>;
  listerTickets(): Promise<TicketSupport[]>;
  listerTicketsParAuteur(auteurId: string): Promise<TicketSupport[]>;
  marquerCommeLu(id: string): Promise<void>;
  sauvegarderMessage(message: MessageTicket): Promise<void>;
}
