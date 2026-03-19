import { Money } from "../value-objects/Money";
export declare class PlatMenu {
    readonly id: string;
    nom: string;
    description: string;
    prix: Money;
    allergenes: string[];
    stockJournalier: number;
    readonly restaurantId: string;
    imageUrl: string | null;
    actif: boolean;
    constructor(id: string, nom: string, description: string, prix: Money, allergenes: string[], stockJournalier: number, restaurantId: string, imageUrl?: string | null, actif?: boolean);
    estDisponible(): boolean;
    diminuerStock(quantite?: number): void;
    mettreAJour(infos: {
        nom?: string;
        description?: string;
        prix?: Money;
        allergenes?: string[];
        stockJournalier?: number;
        imageUrl?: string | null;
        actif?: boolean;
    }): void;
}
//# sourceMappingURL=PlatMenu.d.ts.map