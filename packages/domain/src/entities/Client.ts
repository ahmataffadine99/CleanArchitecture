export class Client {
  constructor(
    public readonly id: string,
    public nom: string,
    public email: string,
    public adresse: string,
    public telephone?: string
  ) {}
}
