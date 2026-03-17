import { ErreurMetier } from "./ErreurMetier";

export class EmailDejaUtiliseError extends ErreurMetier {
  constructor(email: string) {
    super("EMAIL_DEJA_UTILISE", `L'email "${email}" est déjà associé à un compte.`);
  }
}
