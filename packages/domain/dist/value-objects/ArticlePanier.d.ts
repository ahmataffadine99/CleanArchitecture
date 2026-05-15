import { Money } from "./Money";
export declare class ArticlePanier {
    readonly menuItemId: string;
    readonly nom: string;
    readonly prixSnapshot: Money;
    readonly quantite: number;
    readonly restaurantId: string;
    constructor(menuItemId: string, nom: string, prixSnapshot: Money, quantite: number, restaurantId: string);
    prixTotal(): Money;
    avecQuantite(nouvelleQuantite: number): ArticlePanier;
}