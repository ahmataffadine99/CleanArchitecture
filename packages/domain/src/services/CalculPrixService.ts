import { Money } from "../value-objects/Money";
import { ArticlePanier } from "../value-objects/ArticlePanier";

export class CalculPrixService {
  private static readonly TARIF_KM = 0.5;
  private static readonly TAUX_FRAIS_SERVICE = 0.10;

  calculerFraisLivraison(distanceKm: number): Money {
    return Money.fromEuros(distanceKm * CalculPrixService.TARIF_KM);
  }

  calculerFraisService(prixPlats: Money): Money {
    return Money.fromEuros(prixPlats.enEuros() * CalculPrixService.TAUX_FRAIS_SERVICE);
  }

  calculerSousTotalPlats(articles: ReadonlyArray<ArticlePanier>): Money {
    return articles.reduce(
      (total, article) => total.ajouter(article.prixTotal()),
      Money.zero()
    );
  }

  getTauxReduction(points: number): number {
    if (points >= 250) return 0.15;
    if (points >= 100) return 0.10;
    if (points >= 50) return 0.05;
    return 0;
  }

  calculerTotal(articles: ReadonlyArray<ArticlePanier>, distanceKm: number, tauxReduction: number = 0): {
    prixPlats: Money;
    fraisLivraison: Money;
    fraisService: Money;
    reduction: Money;
    total: Money;
  } {
    const prixPlats = this.calculerSousTotalPlats(articles);
    const fraisLivraison = this.calculerFraisLivraison(distanceKm);
    const fraisService = this.calculerFraisService(prixPlats);
    
    const montantReduction = Money.fromEuros(prixPlats.enEuros() * tauxReduction);
    const total = prixPlats.ajouter(fraisLivraison).ajouter(fraisService).soustraire(montantReduction);
    
    return { prixPlats, fraisLivraison, fraisService, reduction: montantReduction, total };
  }
}
