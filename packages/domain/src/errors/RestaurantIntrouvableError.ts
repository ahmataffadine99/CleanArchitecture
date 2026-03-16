import { ErreurMetier } from "./ErreurMetier";

export class RestaurantIntrouvableError extends ErreurMetier {
  constructor(restaurantId: string) {
    super("RESTAURANT_INTROUVABLE", `Restaurant introuvable : ${restaurantId}`);
    this.restaurantId = restaurantId;
  }
  readonly restaurantId: string;
}
