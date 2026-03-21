export class Avis {
  constructor(
    public readonly id: string,
    public readonly commandeId: string,
    public readonly livreurId: string,
    public readonly clientId: string,
    public readonly note: number, // 1 à 5
    public readonly commentaire: string | null = null,
    public readonly creeLe: Date = new Date()
  ) {
    if (note < 1 || note > 5) {
      throw new Error("La note doit être comprise entre 1 et 5");
    }
  }
}
