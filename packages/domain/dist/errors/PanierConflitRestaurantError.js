"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanierConflitRestaurantError = void 0;
const ErreurMetier_1 = require("./ErreurMetier");
// Lancée quand on ajoute un article d'un restaurant différent du panier actuel
class PanierConflitRestaurantError extends ErreurMetier_1.ErreurMetier {
    constructor(restaurantActuelId, nouvelArticleRestaurantId) {
        super("PANIER_CONFLIT_RESTAURANT", `Votre panier contient déjà des articles du restaurant ${restaurantActuelId}. ` +
            `Impossible d'ajouter un article du restaurant ${nouvelArticleRestaurantId}.`);
        this.restaurantActuelId = restaurantActuelId;
        this.nouvelArticleRestaurantId = nouvelArticleRestaurantId;
    }
    restaurantActuelId;
    nouvelArticleRestaurantId;
}
exports.PanierConflitRestaurantError = PanierConflitRestaurantError;
//# sourceMappingURL=PanierConflitRestaurantError.js.map