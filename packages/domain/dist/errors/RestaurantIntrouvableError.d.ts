import { ErreurMetier } from "./ErreurMetier";
export declare class RestaurantIntrouvableError extends ErreurMetier {
    constructor(restaurantId: string);
    readonly restaurantId: string;
}