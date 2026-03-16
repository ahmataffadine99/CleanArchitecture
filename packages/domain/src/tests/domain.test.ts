import { describe, it, expect } from "vitest";
import { CalculDistanceService } from "../src/services/CalculDistanceService";
import { Coordonnees } from "../src/value-objects/Coordonnees";
import { Money } from "../src/value-objects/Money";
import { CalculPrixService } from "../src/services/CalculPrixService";
import { ArticlePanier } from "../src/value-objects/ArticlePanier";
import { StatutCommande } from "../src/value-objects/StatutCommande";
import { Commande } from "../src/entities/Commande";
import { TransitionStatutInvalideError } from "../src/errors/TransitionStatutInvalideError";

describe("CalculDistanceService", () => {
  const calc = new CalculDistanceService();

  it("retourne 0 pour le même point", () => {
    const paris = new Coordonnees(48.8566, 2.3522);
    expect(calc.calculerKm(paris, paris)).toBeCloseTo(0);
  });

  it("calcule correctement Paris → Lyon (~392 km)", () => {
    const paris = new Coordonnees(48.8566, 2.3522);
    const lyon  = new Coordonnees(45.7640, 4.8357);
    const dist = calc.calculerKm(paris, lyon);
    expect(dist).toBeGreaterThan(380);
    expect(dist).toBeLessThan(410);
  });
});

describe("CalculPrixService", () => {
  const service = new CalculPrixService();

  it("calcule les frais de livraison à 0.50€/km", () => {
    expect(service.calculerFraisLivraison(10).enEuros()).toBe(5);
  });

  it("calcule les frais de service à 10%", () => {
    expect(service.calculerFraisService(Money.fromEuros(50)).enEuros()).toBe(5);
  });
});

describe("Commande - workflow statuts", () => {
  const faireCommande = () => new Commande(
    "cmd-1", "client-1", "resto-1",
    [new ArticlePanier("p1", "Burger", Money.fromEuros(10), 1, "resto-1")],
    Money.fromEuros(10), Money.fromEuros(2), Money.fromEuros(1), "10 rue de la Paix"
  );

  it("commence EN_ATTENTE", () => {
    expect(faireCommande().getStatut()).toBe(StatutCommande.EN_ATTENTE);
  });

  it("autorise PAYEE depuis EN_ATTENTE", () => {
    const cmd = faireCommande();
    cmd.changerStatut(StatutCommande.PAYEE);
    expect(cmd.getStatut()).toBe(StatutCommande.PAYEE);
  });

  it("refuse une transition invalide", () => {
    const cmd = faireCommande();
    expect(() => cmd.changerStatut(StatutCommande.LIVREE)).toThrow(TransitionStatutInvalideError);
  });

  it("calcule le prix total correctement", () => {
    const cmd = faireCommande();
    expect(cmd.prixTotal().enEuros()).toBe(13); // 10 + 2 + 1
  });
});
