import { ErreurMetier } from "./ErreurMetier";

export class CommandeIntrouvableError extends ErreurMetier {
  constructor(commandeId: string) {
    super("COMMANDE_INTROUVABLE", `Aucune commande trouvée avec l'identifiant : ${commandeId}`);
    this.commandeId = commandeId;
  }
  readonly commandeId: string;
}
