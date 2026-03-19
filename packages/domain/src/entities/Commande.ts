import { Money } from "../value-objects/Money";
import { StatutCommande, transitionAutorisee } from "../value-objects/StatutCommande";
import { ArticlePanier } from "../value-objects/ArticlePanier";
import { TransitionStatutInvalideError } from "../errors/TransitionStatutInvalideError";

export class Commande {
  private statut: StatutCommande = StatutCommande.EN_ATTENTE;
  private tempsPreparationEstime: number | null = null; // en minutes
  private livreurId: string | null = null;
  private readonly creeLe: Date;

  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly restaurantId: string,
    private readonly articles: ArticlePanier[],
    private readonly prixPlats: Money,
    private readonly fraisLivraison: Money,
    private readonly fraisService: Money,
    private readonly adresseLivraison: string,
    private readonly reduction: Money = Money.zero()
  ) {
    this.creeLe = new Date();
  }

  changerStatut(nouveauStatut: StatutCommande): void {
    if (!transitionAutorisee(this.statut, nouveauStatut)) {
      throw new TransitionStatutInvalideError(this.statut, nouveauStatut);
    }
    this.statut = nouveauStatut;
  }

  accepter(tempsPreparation: number): void {
    this.changerStatut(StatutCommande.ACCEPTEE);
    this.tempsPreparationEstime = tempsPreparation;
    this.changerStatut(StatutCommande.EN_PREPARATION);
  }

  marquerPrete(): void {
    this.changerStatut(StatutCommande.PRETE);
  }

  assignerLivreur(livreurId: string): void {
    this.livreurId = livreurId;
    this.changerStatut(StatutCommande.EN_LIVRAISON);
  }

  marquerLivree(): void {
    this.changerStatut(StatutCommande.LIVREE);
  }

  prixTotal(): Money {
    return this.prixPlats.ajouter(this.fraisLivraison).ajouter(this.fraisService).soustraire(this.reduction);
  }

  getStatut(): StatutCommande {
    return this.statut;
  }

  getArticles(): ReadonlyArray<ArticlePanier> {
    return this.articles;
  }

  getPrixPlats(): Money { return this.prixPlats; }
  getFraisLivraison(): Money { return this.fraisLivraison; }
  getFraisService(): Money { return this.fraisService; }
  getReduction(): Money { return this.reduction; }
  getLivreurId(): string | null { return this.livreurId; }
  getTempsPreparation(): number | null { return this.tempsPreparationEstime; }
  getCreeLe(): Date { return this.creeLe; }
  getAdresseLivraison(): string { return this.adresseLivraison; }

  restaurerTempsPreparation(minutes: number): void {
    this.tempsPreparationEstime = minutes;
  }
}
