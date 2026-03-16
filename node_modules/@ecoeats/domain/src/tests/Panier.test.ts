import { describe, it, expect } from "vitest";
import { Panier } from "../src/entities/Panier";
import { ArticlePanier } from "../src/value-objects/ArticlePanier";
import { Money } from "../src/value-objects/Money";
import { PanierConflitRestaurantError } from "../src/errors/PanierConflitRestaurantError";

describe("Panier", () => {
  const faireArticle = (restaurantId: string, menuItemId = "plat-1") =>
    new ArticlePanier(menuItemId, "Burger", Money.fromEuros(10), 1, restaurantId);

  it("accepte des articles du même restaurant", () => {
    const panier = new Panier("client-1");
    panier.ajouterArticle(faireArticle("resto-A"));
    expect(panier.getArticles()).toHaveLength(1);
  });

  it("refuse des articles d'un restaurant différent", () => {
    const panier = new Panier("client-1");
    panier.ajouterArticle(faireArticle("resto-A"));

    expect(() => panier.ajouterArticle(faireArticle("resto-B"))).toThrow(PanierConflitRestaurantError);
  });

  it("cumule les quantités pour le même plat", () => {
    const panier = new Panier("client-1");
    panier.ajouterArticle(new ArticlePanier("plat-1", "Burger", Money.fromEuros(10), 1, "resto-A"));
    panier.ajouterArticle(new ArticlePanier("plat-1", "Burger", Money.fromEuros(10), 2, "resto-A"));

    expect(panier.getArticles()[0].quantite).toBe(3);
  });

  it("calcule le prix total correctement", () => {
    const panier = new Panier("client-1");
    panier.ajouterArticle(new ArticlePanier("plat-1", "Burger", Money.fromEuros(12), 2, "resto-A"));
    panier.ajouterArticle(new ArticlePanier("plat-2", "Frites", Money.fromEuros(4), 1, "resto-A"));

    expect(panier.prixTotal().enEuros()).toBe(28); // 2*12 + 4
  });

  it("se vide correctement", () => {
    const panier = new Panier("client-1");
    panier.ajouterArticle(faireArticle("resto-A"));
    panier.vider();

    expect(panier.estVide()).toBe(true);
    expect(panier.getRestaurantId()).toBeNull();
  });
});
