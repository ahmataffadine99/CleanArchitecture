import { ErreurMetier } from "./ErreurMetier";

export class IdentifiantsInvalidesError extends ErreurMetier {
  constructor() {
    super("IDENTIFIANTS_INVALIDES", "Email ou mot de passe incorrect.");
  }
}
