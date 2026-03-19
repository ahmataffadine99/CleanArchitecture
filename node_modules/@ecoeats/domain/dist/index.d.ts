declare class Money {
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

declare enum StatutCommande {
    EN_ATTENTE = "EN_ATTENTE",// commande créée, pas encore payée
    PAYEE = "PAYEE",// paiement validé
    ACCEPTEE = "ACCEPTEE",// restaurateur a accepté
    REFUSEE = "REFUSEE",// restaurateur a refusé
    EN_PREPARATION = "EN_PREPARATION",
    PRETE = "PRETE",// prête pour collecte
    EN_LIVRAISON = "EN_LIVRAISON",
    LIVREE = "LIVREE"
}
declare function transitionAutorisee(depuis: StatutCommande, vers: StatutCommande): boolean;

declare class ArticlePanier {
    readonly menuItemId: string;
    readonly nom: string;
    readonly prixSnapshot: Money;
    readonly quantite: number;
    readonly restaurantId: string;
    constructor(menuItemId: string, nom: string, prixSnapshot: Money, quantite: number, restaurantId: string);
    prixTotal(): Money;
    avecQuantite(nouvelleQuantite: number): ArticlePanier;
}

declare class Commande {
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

declare class PlatMenu {
    readonly id: string;
    nom: string;
    description: string;
    prix: Money;
    allergenes: string[];
    stockJournalier: number;
    readonly restaurantId: string;
    imageUrl: string | null;
    actif: boolean;
    constructor(id: string, nom: string, description: string, prix: Money, allergenes: string[], stockJournalier: number, restaurantId: string, imageUrl?: string | null, actif?: boolean);
    estDisponible(): boolean;
    diminuerStock(quantite?: number): void;
    mettreAJour(infos: {
        nom?: string;
        description?: string;
        prix?: Money;
        allergenes?: string[];
        stockJournalier?: number;
        imageUrl?: string | null;
        actif?: boolean;
    }): void;
}

declare class Coordonnees {
    readonly latitude: number;
    readonly longitude: number;
    constructor(latitude: number, longitude: number);
    estEgal(autre: Coordonnees): boolean;
    toString(): string;
}

declare class Restaurant {
    readonly id: string;
    nom: string;
    adresse: string;
    position: Coordonnees;
    readonly proprietaireId: string;
    imageUrl: string | null;
    constructor(id: string, nom: string, adresse: string, position: Coordonnees, proprietaireId: string, imageUrl?: string | null);
}

declare class Panier {
    readonly clientId: string;
    private articles;
    private restaurantIdActuel;
    constructor(clientId: string);
    ajouterArticle(article: ArticlePanier): void;
    retirerArticle(platId: string): void;
    vider(): void;
    getArticles(): ReadonlyArray<ArticlePanier>;
    getRestaurantId(): string | null;
    estVide(): boolean;
    prixTotal(): Money;
}

declare class Client {
    readonly id: string;
    nom: string;
    email: string;
    adresse: string;
    telephone?: string | undefined;
    private pointsFidelite;
    constructor(id: string, nom: string, email: string, adresse: string, telephone?: string | undefined, pointsFidelite?: number);
    getPointsFidelite(): number;
    crediterPoints(points: number): void;
}

declare enum StatutLivreur {
    DISPONIBLE = "DISPONIBLE",
    INDISPONIBLE = "INDISPONIBLE",
    EN_LIVRAISON = "EN_LIVRAISON"
}

declare class Livreur {
    readonly id: string;
    nom: string;
    position: Coordonnees;
    telephone: string;
    private statut;
    private portefeuille;
    private commandesEnCoursIds;
    private propositionsIds;
    estExpert: boolean;
    constructor(id: string, nom: string, position: Coordonnees, telephone: string, estExpert?: boolean, portefeuille?: Money, propositionsIds?: string[]);
    seDeclarerDisponible(): void;
    seDeclarerIndisponible(): void;
    prendreEnCharge(commandeId: string): void;
    terminerLivraison(commandeId: string, gains: Money): void;
    estDisponible(restaurantId?: string): boolean;
    getStatut(): StatutLivreur;
    getPortefeuille(): Money;
    getCommandesEnCoursIds(): string[];
    getPropositionsIds(): string[];
    recevoirProposition(commandeId: string): void;
    accepterProposition(commandeId: string): void;
    refuserProposition(commandeId: string): void;
}

declare class Facture {
    readonly id: string;
    readonly commandeId: string;
    readonly clientId: string;
    readonly articles: ReadonlyArray<ArticlePanier>;
    readonly prixPlats: Money;
    readonly fraisLivraison: Money;
    readonly fraisService: Money;
    readonly total: Money;
    readonly genereLe: Date;
    constructor(id: string, commandeId: string, clientId: string, articles: ReadonlyArray<ArticlePanier>, prixPlats: Money, fraisLivraison: Money, fraisService: Money, total: Money);
    afficher(): string;
}

type RoleUtilisateur = "CLIENT" | "RESTAURATEUR" | "LIVREUR";
declare class CompteUtilisateur {
    readonly id: string;
    readonly email: string;
    readonly motDePasseHache: string;
    readonly role: RoleUtilisateur;
    readonly profilId: string;
    constructor(id: string, email: string, motDePasseHache: string, role: RoleUtilisateur, profilId: string);
}

declare abstract class ErreurMetier extends Error {
    readonly code: string;
    constructor(code: string, message: string);
}

declare class PanierConflitRestaurantError extends ErreurMetier {
    constructor(restaurantActuelId: string, nouvelArticleRestaurantId: string);
    readonly restaurantActuelId: string;
    readonly nouvelArticleRestaurantId: string;
}

declare class PlatEnRuptureError extends ErreurMetier {
    constructor(platId: string);
    readonly platId: string;
}

declare class CommandeIntrouvableError extends ErreurMetier {
    constructor(commandeId: string);
    readonly commandeId: string;
}

declare class AucunLivreurDisponibleError extends ErreurMetier {
    constructor(restaurantId: string);
    readonly restaurantId: string;
}

declare class TransitionStatutInvalideError extends ErreurMetier {
    constructor(depuis: StatutCommande, vers: StatutCommande);
}

declare class RestaurantIntrouvableError extends ErreurMetier {
    constructor(restaurantId: string);
    readonly restaurantId: string;
}

declare class ClientIntrouvableError extends ErreurMetier {
    constructor(clientId: string);
    readonly clientId: string;
}

declare class PlatIntrouvableError extends ErreurMetier {
    constructor(platId: string);
    readonly platId: string;
}

declare class IdentifiantsInvalidesError extends ErreurMetier {
    constructor();
}

declare class EmailDejaUtiliseError extends ErreurMetier {
    constructor(email: string);
}

declare class CalculDistanceService {
    private static readonly RAYON_TERRE_KM;
    calculerKm(pointA: Coordonnees, pointB: Coordonnees): number;
    private versRadians;
}

declare class CalculPrixService {
    private static readonly TARIF_KM;
    private static readonly TAUX_FRAIS_SERVICE;
    calculerFraisLivraison(distanceKm: number): Money;
    calculerFraisService(prixPlats: Money): Money;
    calculerSousTotalPlats(articles: ReadonlyArray<ArticlePanier>): Money;
    getTauxReduction(points: number): number;
    calculerTotal(articles: ReadonlyArray<ArticlePanier>, distanceKm: number, tauxReduction?: number): {
        prixPlats: Money;
        fraisLivraison: Money;
        fraisService: Money;
        reduction: Money;
        total: Money;
    };
}

declare class SelectionLivreurService {
    private readonly calculDistance;
    trouverLePlusProche(livreurs: Livreur[], positionRestaurant: Coordonnees, restaurantId: string): Livreur;
}

declare class CalculGainsLivreurService {
    private static readonly PRISE_EN_CHARGE;
    private static readonly PRIX_KM;
    /**
     * Formule : Prise en charge + (Distance * Prix_KM) + Pourboire
     */
    calculerGains(distanceKm: number, pourboire?: Money): Money;
}

type CommandeCreee = {
    type: "CommandeCreee";
    commandeId: string;
    clientId: string;
    restaurantId: string;
    date: Date;
};
type CommandePayee = {
    type: "CommandePayee";
    commandeId: string;
    factureId: string;
    date: Date;
};
type CommandeAcceptee = {
    type: "CommandeAcceptee";
    commandeId: string;
    restaurantId: string;
    tempsPreparationMinutes: number;
    date: Date;
};
type CommandeRefusee = {
    type: "CommandeRefusee";
    commandeId: string;
    restaurantId: string;
    date: Date;
};
type CommandePrete = {
    type: "CommandePrete";
    commandeId: string;
    date: Date;
};
type CommandeLivree = {
    type: "CommandeLivree";
    commandeId: string;
    livreurId: string;
    date: Date;
};
type EvenementCommande = CommandeCreee | CommandePayee | CommandeAcceptee | CommandeRefusee | CommandePrete | CommandeLivree;

export { ArticlePanier, AucunLivreurDisponibleError, CalculDistanceService, CalculGainsLivreurService, CalculPrixService, Client, ClientIntrouvableError, Commande, type CommandeAcceptee, type CommandeCreee, CommandeIntrouvableError, type CommandeLivree, type CommandePayee, type CommandePrete, type CommandeRefusee, CompteUtilisateur, Coordonnees, EmailDejaUtiliseError, ErreurMetier, type EvenementCommande, Facture, IdentifiantsInvalidesError, Livreur, Money, Panier, PanierConflitRestaurantError, PlatEnRuptureError, PlatIntrouvableError, PlatMenu, Restaurant, RestaurantIntrouvableError, type RoleUtilisateur, SelectionLivreurService, StatutCommande, StatutLivreur, TransitionStatutInvalideError, transitionAutorisee };
