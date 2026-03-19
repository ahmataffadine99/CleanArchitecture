import { Money } from "../value-objects/Money";
import { Coordonnees } from "../value-objects/Coordonnees";
import { StatutLivreur } from "../value-objects/StatutLivreur";
export declare class Livreur {
    readonly id: string;
    nom: string;
    position: Coordonnees;
    telephone: string;
    private statut;
    private portefeuille;
    private commandesEnCoursIds;
    private propositionsIds;
    estExpert: boolean;
    constructor(id: string, nom: string, position: Coordonnees, telephone: string, estExpert?: boolean, portefeuille?: Money, propositionsIds?: string[]);
    seDeclarerDisponible(): void;
    seDeclarerIndisponible(): void;
    prendreEnCharge(commandeId: string): void;
    terminerLivraison(commandeId: string, gains: Money): void;
    estDisponible(restaurantId?: string): boolean;
    getStatut(): StatutLivreur;
    getPortefeuille(): Money;
    getCommandesEnCoursIds(): string[];
    getPropositionsIds(): string[];
    recevoirProposition(commandeId: string): void;
    accepterProposition(commandeId: string): void;
    refuserProposition(commandeId: string): void;
}
//# sourceMappingURL=Livreur.d.ts.map