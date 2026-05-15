import { ErreurMetier } from "./ErreurMetier";
export declare class PanierConflitRestaurantError extends ErreurMetier {
    constructor(restaurantActuelId: string, nouvelArticleRestaurantId: string);
    readonly restaurantActuelId: string;
    readonly nouvelArticleRestaurantId: string;
}