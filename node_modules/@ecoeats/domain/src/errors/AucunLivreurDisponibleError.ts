import { ErreurMetier } from "./ErreurMetier";

export class AucunLivreurDisponibleError extends ErreurMetier {
  constructor(restaurantId: string) {
    super(
      "AUCUN_LIVREUR_DISPONIBLE",
      `Aucun livreur disponible à proximité du restaurant ${restaurantId}.`
    );
    this.restaurantId = restaurantId;
  }
  readonly restaurantId: string;
}
