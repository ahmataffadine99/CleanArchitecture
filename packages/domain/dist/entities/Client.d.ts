export declare class Client {
    readonly id: string;
    nom: string;
    email: string;
    adresse: string;
    telephone?: string | undefined;
    private pointsFidelite;
    constructor(id: string, nom: string, email: string, adresse: string, telephone?: string | undefined, pointsFidelite?: number);
    getPointsFidelite(): number;
    crediterPoints(points: number): void;
}