export declare abstract class ErreurMetier extends Error {
    readonly code: string;
    constructor(code: string, message: string);
}