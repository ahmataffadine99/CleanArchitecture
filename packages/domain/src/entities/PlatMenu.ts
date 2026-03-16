import { Money } from "../value-objects/Money";

export class PlatMenu {
  constructor(
    public readonly id: string,
    public nom: string,
    public description: string,
    public prix: Money,
    public allergenes: string[],
    public stockJournalier: number,
    public readonly restaurantId: string
  ) {}

  estDisponible(): boolean {
    return this.stockJournalier > 0;
  }

  diminuerStock(quantite: number = 1): void {
    if (quantite > this.stockJournalier) {
      throw new Error(`Stock insuffisant pour "${this.nom}" (stock: ${this.stockJournalier})`);
    }
    this.stockJournalier -= quantite;
  }

  mettreAJour(infos: {
    nom?: string;
    description?: string;
    prix?: Money;
    allergenes?: string[];
    stockJournalier?: number;
  }): void {
    if (infos.nom !== undefined) this.nom = infos.nom;
    if (infos.description !== undefined) this.description = infos.description;
    if (infos.prix !== undefined) this.prix = infos.prix;
    if (infos.allergenes !== undefined) this.allergenes = infos.allergenes;
    if (infos.stockJournalier !== undefined) this.stockJournalier = infos.stockJournalier;
  }
}
