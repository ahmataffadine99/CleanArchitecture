import { Coordonnees } from "../value-objects/Coordonnees";
export declare class Restaurant {
    readonly id: string;
    nom: string;
    adresse: string;
    position: Coordonnees;
    readonly proprietaireId: string;
    imageUrl: string | null;
    constructor(id: string, nom: string, adresse: string, position: Coordonnees, proprietaireId: string, imageUrl?: string | null);
}