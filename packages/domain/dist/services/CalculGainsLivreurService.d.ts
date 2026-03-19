import { Money } from "../value-objects/Money";
export declare class CalculGainsLivreurService {
    private static readonly PRISE_EN_CHARGE;
    private static readonly PRIX_KM;
    /**
     * Formule : Prise en charge + (Distance * Prix_KM) + Pourboire
     */
    calculerGains(distanceKm: number, pourboire?: Money): Money;
}
//# sourceMappingURL=CalculGainsLivreurService.d.ts.map