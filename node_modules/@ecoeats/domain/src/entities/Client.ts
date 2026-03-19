export class Client {
  private pointsFidelite: number;

  constructor(
    public readonly id: string,
    public nom: string,
    public email: string,
    public adresse: string,
    public telephone?: string,
    pointsFidelite: number = 0
  ) {
    this.pointsFidelite = pointsFidelite;
  }

  getPointsFidelite(): number {
    return this.pointsFidelite;
  }

  crediterPoints(points: number): void {
    if (points > 0) this.pointsFidelite += points;
  }
}
