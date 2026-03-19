import { Money } from "../value-objects/Money";
import { ArticlePanier } from "../value-objects/ArticlePanier";

// Formule : prix plats + frais livraison (0.50€/km) + frais service (10% du sous-total)
export class CalculPrixService {
  private static readonly TARIF_KM = 0.5;         // euros par km
  private static readonly TAUX_FRAIS_SERVICE = 0.10; // 10%

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
    if (points >= 250) return 0.15; // Platine 15%
    if (points >= 100) return 0.10; // Or 10%
    if (points >= 50) return 0.05;  // Argent 5%
    return 0; // Bronze 0%
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
