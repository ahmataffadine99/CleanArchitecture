export type StatutTicket = "OUVERT" | "CLOS";

export class MessageTicket {
  constructor(
    public readonly id: string,
    public readonly ticketId: string,
    public readonly auteurId: string,
    public readonly contenu: string,
    public readonly estAdmin: boolean,
    public readonly envoyeLe: Date
  ) {}
}

export class TicketSupport {
  constructor(
    public readonly id: string,
    public readonly auteurId: string,
    public readonly titre: string,
    public readonly statut: StatutTicket,
    public readonly creeLe: Date,
    public readonly messages: MessageTicket[] = [],
    public readonly estLu: boolean = false,
    public readonly auteurNom?: string,
    public readonly auteurRole?: string
  ) {}
}
