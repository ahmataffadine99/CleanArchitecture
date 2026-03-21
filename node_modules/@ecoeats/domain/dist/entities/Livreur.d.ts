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
    private currentRestaurantId?;
    constructor(id: string, nom: string, position: Coordonnees, telephone: string, estExpert?: boolean, portefeuille?: Money, propositionsIds?: string[], currentRestaurantId?: string);
    seDeclarerDisponible(): void;
    seDeclarerIndisponible(): void;
    prendreEnCharge(commandeId: string, restaurantId: string): void;
    terminerLivraison(commandeId: string, gains: Money): void;
    estDisponible(restaurantId?: string): boolean;
    getCurrentRestaurantId(): string | undefined;
    getStatut(): StatutLivreur;
    getPortefeuille(): Money;
    getCommandesEnCoursIds(): string[];
    getPropositionsIds(): string[];
    recevoirProposition(commandeId: string): void;
    accepterProposition(commandeId: string, restaurantId: string): void;
    refuserProposition(commandeId: string): void;
}
//# sourceMappingURL=Livreur.d.ts.map