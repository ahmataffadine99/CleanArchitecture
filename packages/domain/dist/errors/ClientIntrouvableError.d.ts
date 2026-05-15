import { ErreurMetier } from "./ErreurMetier";
export declare class ClientIntrouvableError extends ErreurMetier {
    constructor(clientId: string);
    readonly clientId: string;
}