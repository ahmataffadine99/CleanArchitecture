import { Money } from "../value-objects/Money";
import { ArticlePanier } from "../value-objects/ArticlePanier";
export declare class Facture {
    readonly id: string;
    readonly commandeId: string;
    readonly clientId: string;
    readonly articles: ReadonlyArray<ArticlePanier>;
    readonly prixPlats: Money;
    readonly fraisLivraison: Money;
    readonly fraisService: Money;
    readonly total: Money;
    readonly genereLe: Date;
    constructor(id: string, commandeId: string, clientId: string, articles: ReadonlyArray<ArticlePanier>, prixPlats: Money, fraisLivraison: Money, fraisService: Money, total: Money);
    afficher(): string;
}
//# sourceMappingURL=Facture.d.ts.map