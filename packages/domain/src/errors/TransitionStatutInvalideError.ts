import { ErreurMetier } from "./ErreurMetier";
import { StatutCommande } from "../value-objects/StatutCommande";

export class TransitionStatutInvalideError extends ErreurMetier {
  constructor(depuis: StatutCommande, vers: StatutCommande) {
    super(
      "TRANSITION_STATUT_INVALIDE",
      `Impossible de passer du statut "${depuis}" vers "${vers}".`
    );
  }
}
