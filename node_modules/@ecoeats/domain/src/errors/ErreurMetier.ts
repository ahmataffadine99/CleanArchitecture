// Classe de base pour toutes les erreurs métier — permet de les distinguer des erreurs techniques
export abstract class ErreurMetier extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
