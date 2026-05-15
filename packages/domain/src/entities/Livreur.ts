import { Money } from "../value-objects/Money";
import { Coordonnees } from "../value-objects/Coordonnees";
import { StatutLivreur } from "../value-objects/StatutLivreur";

export class Livreur {
  private statut: StatutLivreur = StatutLivreur.INDISPONIBLE;
  private portefeuille: Money = Money.zero();
  private commandesEnCoursIds: string[] = [];
  private propositionsIds: string[] = [];
  public estExpert: boolean = false;
  private currentRestaurantId?: string;

  constructor(
    public readonly id: string,
    public nom: string,
    public position: Coordonnees,
    public telephone: string,
    estExpert: boolean = false,
    portefeuille: Money = Money.zero(),
    propositionsIds: string[] = [],
    currentRestaurantId?: string
  ) {
    this.estExpert = estExpert;
    this.portefeuille = portefeuille;
    this.propositionsIds = propositionsIds;
    this.currentRestaurantId = currentRestaurantId;
  }

  seDeclarerDisponible(): void {
    this.statut = StatutLivreur.DISPONIBLE;
  }

  seDeclarerIndisponible(): void {
    if (this.statut === StatutLivreur.EN_LIVRAISON) {
      throw new Error("Impossible de se déclarer indisponible pendant une livraison en cours");
    }
    this.statut = StatutLivreur.INDISPONIBLE;
  }

  prendreEnCharge(commandeId: string, restaurantId: string): void {
    if (this.statut === StatutLivreur.INDISPONIBLE) {
      throw new Error(`Le livreur ${this.nom} n'est pas disponible`);
    }

    const nbMax = this.estExpert ? 2 : 1;
    if (this.commandesEnCoursIds.length >= nbMax) {
      throw new Error(`Le livreur ${this.nom} a déjà atteint sa limite de livraisons (${nbMax})`);
    }

    if (this.commandesEnCoursIds.length > 0 && this.currentRestaurantId && this.currentRestaurantId !== restaurantId) {
      throw new Error(`En tant qu'expert, vous ne pouvez cumuler des commandes que du même restaurant.`);
    }

    this.statut = StatutLivreur.EN_LIVRAISON;
    this.commandesEnCoursIds.push(commandeId);
    this.currentRestaurantId = restaurantId;
  }

  terminerLivraison(commandeId: string, gains: Money): void {
    this.commandesEnCoursIds = this.commandesEnCoursIds.filter(id => id !== commandeId);
    this.portefeuille = this.portefeuille.ajouter(gains);
    
    if (this.commandesEnCoursIds.length === 0) {
      this.statut = StatutLivreur.DISPONIBLE;
      this.currentRestaurantId = undefined;
    }
  }

  estDisponible(restaurantId?: string): boolean {
    if (this.statut === StatutLivreur.INDISPONIBLE) return false;
    
    if (this.commandesEnCoursIds.length === 0) return true;
    
    const nbMax = this.estExpert ? 2 : 1;
    if (this.commandesEnCoursIds.length >= nbMax) return false;

    if (restaurantId && this.currentRestaurantId && this.currentRestaurantId !== restaurantId) {
       return false;
    }

    return true;
  }

  getCurrentRestaurantId(): string | undefined { return this.currentRestaurantId; }

  getStatut(): StatutLivreur { return this.statut; }
  getPortefeuille(): Money { return this.portefeuille; }
  getCommandesEnCoursIds(): string[] { return this.commandesEnCoursIds; }
  getPropositionsIds(): string[] { return this.propositionsIds; }

  recevoirProposition(commandeId: string): void {
    if (!this.propositionsIds.includes(commandeId)) {
      this.propositionsIds.push(commandeId);
    }
  }

  accepterProposition(commandeId: string, restaurantId: string): void {
    if (!this.propositionsIds.includes(commandeId)) {
      throw new Error("Proposition non trouvée");
    }
    this.propositionsIds = this.propositionsIds.filter(id => id !== commandeId);
    this.prendreEnCharge(commandeId, restaurantId);
  }

  refuserProposition(commandeId: string): void {
    this.propositionsIds = this.propositionsIds.filter(id => id !== commandeId);
  }
}
