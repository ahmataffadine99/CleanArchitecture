import { ArticlePanier } from "../value-objects/ArticlePanier";
import { Money } from "../value-objects/Money";
import { PanierConflitRestaurantError } from "../errors/PanierConflitRestaurantError";
import { PlatEnRuptureError } from "../errors/PlatEnRuptureError";

// Règle métier : un panier ne peut contenir que des articles d'un seul restaurant
export class Panier {
  private articles: ArticlePanier[] = [];
  private restaurantIdActuel: string | null = null;

  constructor(public readonly clientId: string) {}

  ajouterArticle(article: ArticlePanier): void {
    if (this.restaurantIdActuel && this.restaurantIdActuel !== article.restaurantId) {
      throw new PanierConflitRestaurantError(
        this.restaurantIdActuel,
        article.restaurantId
      );
    }

    if (article.quantite <= 0) {
      throw new PlatEnRuptureError(article.menuItemId);
    }

    this.restaurantIdActuel = article.restaurantId;

    const existant = this.articles.find(a => a.menuItemId === article.menuItemId);
    if (existant) {
      const index = this.articles.indexOf(existant);
      this.articles[index] = existant.avecQuantite(existant.quantite + article.quantite);
    } else {
      this.articles.push(article);
    }
  }

  vider(): void {
    this.articles = [];
    this.restaurantIdActuel = null;
  }

  getArticles(): ReadonlyArray<ArticlePanier> {
    return this.articles;
  }

  getRestaurantId(): string | null {
    return this.restaurantIdActuel;
  }

  estVide(): boolean {
    return this.articles.length === 0;
  }

  prixTotal(): Money {
    return this.articles.reduce(
      (total, article) => total.ajouter(article.prixTotal()),
      Money.zero()
    );
  }
}
