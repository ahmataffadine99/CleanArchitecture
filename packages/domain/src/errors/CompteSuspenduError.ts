import { ErreurMetier } from "./ErreurMetier";

export class CompteSuspenduError extends ErreurMetier {
  constructor() {
    super(
      "COMPTE_SUSPENDU",
      "Compte suspendu. Veuillez contacter le support."
    );
  }
}
