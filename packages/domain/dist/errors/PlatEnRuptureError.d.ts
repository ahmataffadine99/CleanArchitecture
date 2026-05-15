import { ErreurMetier } from "./ErreurMetier";
export declare class PlatEnRuptureError extends ErreurMetier {
    constructor(platId: string);
    readonly platId: string;
}