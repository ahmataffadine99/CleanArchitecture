import { ErreurMetier } from "./ErreurMetier";
export declare class AucunLivreurDisponibleError extends ErreurMetier {
    constructor(restaurantId: string);
    readonly restaurantId: string;
}