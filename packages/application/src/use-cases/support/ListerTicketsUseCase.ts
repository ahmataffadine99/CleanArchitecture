import { TicketSupport } from "@ecoeats/domain";
import { DepotTickets } from "../../ports/DepotTickets";

export class ListerTicketsUseCase {
  constructor(private readonly depotTickets: DepotTickets) {}

  async executer(auteurId?: string): Promise<TicketSupport[]> {
    if (auteurId) {
      return this.depotTickets.listerTicketsParAuteur(auteurId);
    }
    return this.depotTickets.listerTickets();
  }
}
