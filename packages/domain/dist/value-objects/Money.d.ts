export declare class Money {
    private readonly centimes;
    private constructor();
    static fromEuros(euros: number): Money;
    static fromCentimes(centimes: number): Money;
    static zero(): Money;
    ajouter(autre: Money): Money;
    soustraire(autre: Money): Money;
    multiplier(facteur: number): Money;
    enEuros(): number;
    enCentimes(): number;
    estEgal(autre: Money): boolean;
    toString(): string;
}