import { Coordonnees } from "../value-objects/Coordonnees";

export class Restaurant {
  constructor(
    public readonly id: string,
    public nom: string,
    public adresse: string,
    public position: Coordonnees,
    public readonly proprietaireId: string
  ) {}
}
