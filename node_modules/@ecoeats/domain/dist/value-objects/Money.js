"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
// Représente un montant monétaire en centimes pour éviter les erreurs de virgule flottante
class Money {
    centimes;
    constructor(centimes) {
        if (centimes < 0) {
            throw new Error("Un montant ne peut pas être négatif");
        }
        this.centimes = Math.round(centimes);
    }
    static fromEuros(euros) {
        return new Money(euros * 100);
    }
    static fromCentimes(centimes) {
        return new Money(centimes);
    }
    static zero() {
        return new Money(0);
    }
    ajouter(autre) {
        return new Money(this.centimes + autre.centimes);
    }
    soustraire(autre) {
        const nouveauMontant = this.centimes - autre.centimes;
        return new Money(nouveauMontant < 0 ? 0 : nouveauMontant);
    }
    multiplier(facteur) {
        return new Money(this.centimes * facteur);
    }
    enEuros() {
        return this.centimes / 100;
    }
    enCentimes() {
        return this.centimes;
    }
    estEgal(autre) {
        return this.centimes === autre.centimes;
    }
    toString() {
        return `${this.enEuros().toFixed(2)} €`;
    }
}
exports.Money = Money;
//# sourceMappingURL=Money.js.map