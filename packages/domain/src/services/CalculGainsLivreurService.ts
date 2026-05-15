import { Money } from "../value-objects/Money";

export class CalculGainsLivreurService {
  private static readonly PRISE_EN_CHARGE = 2.50;
  private static readonly PRIX_KM = 1.00;

  /**
   * Formule : Prise en charge + (Distance * Prix_KM) + Pourboire
   */
  calculerGains(distanceKm: number, pourboire: Money = Money.zero()): Money {
    const montantKm = Money.fromEuros(distanceKm * CalculGainsLivreurService.PRIX_KM);
    const priseEnCharge = Money.fromEuros(CalculGainsLivreurService.PRISE_EN_CHARGE);
    
    return priseEnCharge.ajouter(montantKm).ajouter(pourboire);
  }
}
