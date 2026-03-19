import { Money } from "../value-objects/Money";
import { StatutCommande } from "../value-objects/StatutCommande";
import { ArticlePanier } from "../value-objects/ArticlePanier";
export declare class Commande {
    readonly id: string;
    readonly clientId: string;
    readonly restaurantId: string;
    private readonly articles;
    private readonly prixPlats;
    private readonly fraisLivraison;
    private readonly fraisService;
    private readonly adresseLivraison;
    private readonly reduction;
    private statut;
    private tempsPreparationEstime;
    private livreurId;
    private readonly creeLe;
    constructor(id: string, clientId: string, restaurantId: string, articles: ArticlePanier[], prixPlats: Money, fraisLivraison: Money, fraisService: Money, adresseLivraison: string, reduction?: Money);
    changerStatut(nouveauStatut: StatutCommande): void;
    accepter(tempsPreparation: number): void;
    marquerPrete(): void;
    assignerLivreur(livreurId: string): void;
    marquerLivree(): void;
    prixTotal(): Money;
    getStatut(): StatutCommande;
    getArticles(): ReadonlyArray<ArticlePanier>;
    getPrixPlats(): Money;
    getFraisLivraison(): Money;
    getFraisService(): Money;
    getReduction(): Money;
    getLivreurId(): string | null;
    getTempsPreparation(): number | null;
    getCreeLe(): Date;
    getAdresseLivraison(): string;
}
//# sourceMappingURL=Commande.d.ts.map