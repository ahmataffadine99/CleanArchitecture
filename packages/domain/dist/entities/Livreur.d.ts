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
    private commandeEnCoursId;
    constructor(id: string, nom: string, position: Coordonnees, telephone: string);
    seDeclarerDisponible(): void;
    seDeclarerIndisponible(): void;
    prendreEnCharge(commandeId: string): void;
    terminerLivraison(gains: Money): void;
    estDisponible(): boolean;
    getStatut(): StatutLivreur;
    getPortefeuille(): Money;
    getCommandeEnCoursId(): string | null;
}
//# sourceMappingURL=Livreur.d.ts.map