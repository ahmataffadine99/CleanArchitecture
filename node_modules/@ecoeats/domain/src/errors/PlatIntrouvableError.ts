import { ErreurMetier } from "./ErreurMetier";

export class PlatIntrouvableError extends ErreurMetier {
  constructor(platId: string) {
    super("PLAT_INTROUVABLE", `Plat introuvable : ${platId}`);
    this.platId = platId;
  }
  readonly platId: string;
}
