// Représente un montant monétaire en centimes pour éviter les erreurs de virgule flottante
export class Money {
  private readonly centimes: number;

  private constructor(centimes: number) {
    if (centimes < 0) {
      throw new Error("Un montant ne peut pas être négatif");
    }
    this.centimes = Math.round(centimes);
  }

  static fromEuros(euros: number): Money {
    return new Money(euros * 100);
  }

  static fromCentimes(centimes: number): Money {
    return new Money(centimes);
  }

  static zero(): Money {
    return new Money(0);
  }

  ajouter(autre: Money): Money {
    return new Money(this.centimes + autre.centimes);
  }

  soustraire(autre: Money): Money {
    const nouveauMontant = this.centimes - autre.centimes;
    return new Money(nouveauMontant < 0 ? 0 : nouveauMontant);
  }

  multiplier(facteur: number): Money {
    return new Money(this.centimes * facteur);
  }

  enEuros(): number {
    return this.centimes / 100;
  }

  enCentimes(): number {
    return this.centimes;
  }

  estEgal(autre: Money): boolean {
    return this.centimes === autre.centimes;
  }

  toString(): string {
    return `${this.enEuros().toFixed(2)} €`;
  }
}
