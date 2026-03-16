import { ErreurMetier } from "./ErreurMetier";

export class PlatEnRuptureError extends ErreurMetier {
  constructor(platId: string) {
    super("PLAT_EN_RUPTURE", `Le plat ${platId} n'est plus disponible (stock épuisé).`);
    this.platId = platId;
  }
  readonly platId: string;
}
