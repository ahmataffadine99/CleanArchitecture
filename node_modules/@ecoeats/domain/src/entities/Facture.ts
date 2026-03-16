import { Money } from "../value-objects/Money";
import { ArticlePanier } from "../value-objects/ArticlePanier";

export class Facture {
  public readonly genereLe: Date;

  constructor(
    public readonly id: string,
    public readonly commandeId: string,
    public readonly clientId: string,
    public readonly articles: ReadonlyArray<ArticlePanier>,
    public readonly prixPlats: Money,
    public readonly fraisLivraison: Money,
    public readonly fraisService: Money,
    public readonly total: Money
  ) {
    this.genereLe = new Date();
  }

  afficher(): string {
    const lignes = this.articles.map(
      a => `  - ${a.nom} x${a.quantite} : ${a.prixTotal().toString()}`
    );
    return [
      `=== FACTURE #${this.id} ===`,
      `Commande : ${this.commandeId}`,
      `Date : ${this.genereLe.toLocaleString()}`,
      ``,
      `Articles :`,
      ...lignes,
      ``,
      `Sous-total (plats) : ${this.prixPlats.toString()}`,
      `Frais de livraison : ${this.fraisLivraison.toString()}`,
      `Frais de service   : ${this.fraisService.toString()}`,
      ``,
      `TOTAL : ${this.total.toString()}`,
    ].join("\n");
  }
}
