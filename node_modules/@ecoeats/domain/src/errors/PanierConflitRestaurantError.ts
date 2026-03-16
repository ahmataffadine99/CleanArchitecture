import { ErreurMetier } from "./ErreurMetier";

// Lancée quand on ajoute un article d'un restaurant différent du panier actuel
export class PanierConflitRestaurantError extends ErreurMetier {
  constructor(restaurantActuelId: string, nouvelArticleRestaurantId: string) {
    super(
      "PANIER_CONFLIT_RESTAURANT",
      `Votre panier contient déjà des articles du restaurant ${restaurantActuelId}. ` +
      `Impossible d'ajouter un article du restaurant ${nouvelArticleRestaurantId}.`
    );
    this.restaurantActuelId = restaurantActuelId;
    this.nouvelArticleRestaurantId = nouvelArticleRestaurantId;
  }

  readonly restaurantActuelId: string;
  readonly nouvelArticleRestaurantId: string;
}
