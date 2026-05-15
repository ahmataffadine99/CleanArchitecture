import { ErreurMetier } from "./ErreurMetier";
export declare class CommandeIntrouvableError extends ErreurMetier {
    constructor(commandeId: string);
    readonly commandeId: string;
}