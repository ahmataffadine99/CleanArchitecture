import { ErreurMetier } from "./ErreurMetier";

export class ClientIntrouvableError extends ErreurMetier {
  constructor(clientId: string) {
    super("CLIENT_INTROUVABLE", `Client introuvable : ${clientId}`);
    this.clientId = clientId;
  }
  readonly clientId: string;
}
