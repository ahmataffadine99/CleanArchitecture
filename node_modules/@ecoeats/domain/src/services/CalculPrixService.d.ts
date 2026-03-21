import { Money } from "../value-objects/Money";
import { ArticlePanier } from "../value-objects/ArticlePanier";
export declare class CalculPrixService {
    private static readonly TARIF_KM;
    private static readonly TAUX_FRAIS_SERVICE;
    calculerFraisLivraison(distanceKm: number): Money;
    calculerFraisService(prixPlats: Money): Money;
    calculerSousTotalPlats(articles: ReadonlyArray<ArticlePanier>): Money;
    getTauxReduction(points: number): number;
    calculerTotal(articles: ReadonlyArray<ArticlePanier>, distanceKm: number, tauxReduction?: number): {
        prixPlats: Money;
        fraisLivraison: Money;
        fraisService: Money;
        reduction: Money;
        total: Money;
    };
}
//# sourceMappingURL=CalculPrixService.d.ts.map