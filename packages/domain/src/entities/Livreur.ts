import { Money } from "../value-objects/Money";
import { Coordonnees } from "../value-objects/Coordonnees";
import { StatutLivreur } from "../value-objects/StatutLivreur";

export class Livreur {
  private statut: StatutLivreur = StatutLivreur.INDISPONIBLE;
  private portefeuille: Money = Money.zero();
  private commandeEnCoursId: string | null = null;

  constructor(
    public readonly id: string,
    public nom: string,
    public position: Coordonnees,
    public telephone: string
  ) {}

  seDeclarerDisponible(): void {
    this.statut = StatutLivreur.DISPONIBLE;
  }

  seDeclarerIndisponible(): void {
    if (this.statut === StatutLivreur.EN_LIVRAISON) {
      throw new Error("Impossible de se déclarer indisponible pendant une livraison en cours");
    }
    this.statut = StatutLivreur.INDISPONIBLE;
  }

  prendreEnCharge(commandeId: string): void {
    if (this.statut !== StatutLivreur.DISPONIBLE) {
      throw new Error(`Le livreur ${this.nom} n'est pas disponible`);
    }
    this.statut = StatutLivreur.EN_LIVRAISON;
    this.commandeEnCoursId = commandeId;
  }

  terminerLivraison(gains: Money): void {
    this.portefeuille = this.portefeuille.ajouter(gains);
    this.statut = StatutLivreur.DISPONIBLE;
    this.commandeEnCoursId = null;
  }

  estDisponible(): boolean {
    return this.statut === StatutLivreur.DISPONIBLE;
  }

  getStatut(): StatutLivreur { return this.statut; }
  getPortefeuille(): Money { return this.portefeuille; }
  getCommandeEnCoursId(): string | null { return this.commandeEnCoursId; }
}
