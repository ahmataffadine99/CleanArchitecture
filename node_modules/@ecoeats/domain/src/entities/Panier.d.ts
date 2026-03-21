import { ArticlePanier } from "../value-objects/ArticlePanier";
import { Money } from "../value-objects/Money";
export declare class Panier {
    readonly clientId: string;
    private articles;
    private restaurantIdActuel;
    constructor(clientId: string);
    ajouterArticle(article: ArticlePanier): void;
    retirerArticle(platId: string): void;
    vider(): void;
    getArticles(): ReadonlyArray<ArticlePanier>;
    getRestaurantId(): string | null;
    estVide(): boolean;
    prixTotal(): Money;
}
//# sourceMappingURL=Panier.d.ts.map