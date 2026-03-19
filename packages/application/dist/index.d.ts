import { Commande as Commande$1, Restaurant, PlatMenu, Client, Livreur, Facture, Coordonnees, CompteUtilisateur, RoleUtilisateur, Panier, Money } from '@ecoeats/domain';

interface DepotCommandes {
    sauvegarder(commande: Commande$1): Promise<void>;
    trouverParId(id: string): Promise<Commande$1>;
    trouverParRestaurant(restaurantId: string): Promise<Commande$1[]>;
    trouverParClient(clientId: string): Promise<Commande$1[]>;
    trouverTout(): Promise<Commande$1[]>;
}

interface DepotRestaurants {
    sauvegarder(restaurant: Restaurant): Promise<void>;
    trouverParId(id: string): Promise<Restaurant>;
    listerTous(): Promise<Restaurant[]>;
    trouverParProprietaireId(proprietaireId: string): Promise<Restaurant | null>;
}

interface DepotPlats {
    sauvegarder(plat: PlatMenu): Promise<void>;
    trouverParId(id: string): Promise<PlatMenu>;
    trouverParRestaurant(restaurantId: string): Promise<PlatMenu[]>;
    supprimer(id: string): Promise<void>;
}

interface DepotClients {
    sauvegarder(client: Client): Promise<void>;
    trouverParId(id: string): Promise<Client>;
}

interface DepotLivreurs {
    sauvegarder(livreur: Livreur): Promise<void>;
    trouverParId(id: string): Promise<Livreur>;
    listerDisponibles(): Promise<Livreur[]>;
}

interface DepotFactures {
    sauvegarder(facture: Facture): Promise<void>;
    trouverParCommande(commandeId: string): Promise<Facture | null>;
}

interface ServiceCartographie {
    calculerDistanceKm(pointA: Coordonnees, pointB: Coordonnees): number;
}

interface ServicePaiement {
    encaisser(montantCentimes: number, clientId: string): Promise<{
        success: boolean;
        transactionId: string;
    }>;
}

interface DepotComptes {
    sauvegarder(compte: CompteUtilisateur): Promise<void>;
    trouverParEmail(email: string): Promise<CompteUtilisateur | null>;
    trouverParId(id: string): Promise<CompteUtilisateur | null>;
}

type Req$a = {
    nom: string;
    email: string;
    motDePasse: string;
    role: RoleUtilisateur;
    adresse?: string;
};
type Res$1 = {
    token: string;
    user: {
        id: string;
        email: string;
        role: string;
        profilId: string;
    };
};
declare class InscriptionUseCase {
    private readonly depotComptes;
    private readonly depotClients;
    private readonly depotRestaurants;
    private readonly secretJwt;
    private readonly SALT_ROUNDS;
    constructor(depotComptes: DepotComptes, depotClients: DepotClients, depotRestaurants: DepotRestaurants, secretJwt: string);
    executer(req: Req$a): Promise<Res$1>;
}

type Req$9 = {
    email: string;
    motDePasse: string;
};
type Res = {
    token: string;
    role: string;
    profilId: string;
};
declare class ConnexionUseCase {
    private readonly depotComptes;
    private readonly secretJwt;
    constructor(depotComptes: DepotComptes, secretJwt: string);
    executer(req: Req$9): Promise<Res>;
}

declare class ListerRestaurantsUseCase {
    private readonly depotRestaurants;
    constructor(depotRestaurants: DepotRestaurants);
    executer(): Promise<Restaurant[]>;
}

type Resultat$2 = {
    disponibles: PlatMenu[];
    rupture: PlatMenu[];
};
declare class VoirMenuRestaurantUseCase {
    private readonly depotPlats;
    constructor(depotPlats: DepotPlats);
    executer(restaurantId: string): Promise<Resultat$2>;
}

type Commande = {
    clientId: string;
    platId: string;
    quantite: number;
};
declare class AjouterAuPanierUseCase {
    private readonly depotPlats;
    private readonly depotClients;
    private readonly paniers;
    constructor(depotPlats: DepotPlats, depotClients: DepotClients);
    executer(req: Commande): Promise<Panier>;
    viderPanier(clientId: string): void;
    retirerDuPanier(clientId: string, platId: string): void;
    getTousLesPaniersParRestaurant(restaurantId: string): Panier[];
    getPanier(clientId: string): Panier | null;
    private obtenirOuCreerPanier;
}

type Req$8 = {
    clientId: string;
    panier: Panier;
    adresseLivraison: string;
};
declare class PasserCommandeUseCase {
    private readonly depotCommandes;
    private readonly depotRestaurants;
    private readonly depotClients;
    private readonly depotPlats;
    private readonly cartographie;
    private readonly calculPrix;
    constructor(depotCommandes: DepotCommandes, depotRestaurants: DepotRestaurants, depotClients: DepotClients, depotPlats: DepotPlats, cartographie: ServiceCartographie);
    executer(req: Req$8): Promise<Commande$1>;
}

type Req$7 = {
    commandeId: string;
    clientId: string;
};
type Resultat$1 = {
    commande: Commande$1;
    facture: Facture;
};
declare class PayerCommandeUseCase {
    private readonly depotCommandes;
    private readonly depotFactures;
    private readonly servicePaiement;
    constructor(depotCommandes: DepotCommandes, depotFactures: DepotFactures, servicePaiement: ServicePaiement);
    executer(req: Req$7): Promise<Resultat$1>;
}

type Req$6 = {
    restaurantId: string;
    nom: string;
    description: string;
    prixEuros: number;
    allergenes: string[];
    stockJournalier: number;
    imageUrl?: string;
    actif?: boolean;
};
declare class AjouterPlatUseCase {
    private readonly depotPlats;
    private readonly depotRestaurants;
    constructor(depotPlats: DepotPlats, depotRestaurants: DepotRestaurants);
    executer(req: Req$6): Promise<PlatMenu>;
}

type Req$5 = {
    platId: string;
    nom?: string;
    description?: string;
    prixEuros?: number;
    allergenes?: string[];
    stockJournalier?: number;
    imageUrl?: string | null;
    actif?: boolean;
};
declare class ModifierPlatUseCase {
    private readonly depotPlats;
    constructor(depotPlats: DepotPlats);
    executer(req: Req$5): Promise<void>;
}

declare class SupprimerPlatUseCase {
    private readonly depotPlats;
    constructor(depotPlats: DepotPlats);
    executer(platId: string): Promise<void>;
}

type Req$4 = {
    commandeId: string;
    tempsPreparationMinutes: number;
};
declare class AccepterCommandeUseCase {
    private readonly depotCommandes;
    constructor(depotCommandes: DepotCommandes);
    executer(req: Req$4): Promise<Commande$1>;
}

declare class RefuserCommandeUseCase {
    private readonly depotCommandes;
    constructor(depotCommandes: DepotCommandes);
    executer(commandeId: string): Promise<Commande$1>;
}

declare class MarquerCommandePreteUseCase {
    private readonly depotCommandes;
    constructor(depotCommandes: DepotCommandes);
    executer(commandeId: string): Promise<Commande$1>;
}

declare class ListerCommandesRestaurantUseCase {
    private readonly depotCommandes;
    constructor(depotCommandes: DepotCommandes);
    executer(restaurantId: string): Promise<Commande$1[]>;
}

type Req$3 = {
    restaurantId: string;
    nom?: string;
    adresse?: string;
    imageUrl?: string | null;
    latitude?: number;
    longitude?: number;
};
declare class ModifierRestaurantUseCase {
    private readonly depotRestaurants;
    constructor(depotRestaurants: DepotRestaurants);
    executer(req: Req$3): Promise<void>;
}

declare class ObtenirMonRestaurantUseCase {
    private readonly depotRestaurants;
    constructor(depotRestaurants: DepotRestaurants);
    executer(proprietaireId: string): Promise<Restaurant | null>;
}

type Req$2 = {
    livreurId: string;
    statut: "DISPONIBLE" | "INDISPONIBLE";
};
declare class ChangerStatutLivreurUseCase {
    private readonly depotLivreurs;
    constructor(depotLivreurs: DepotLivreurs);
    executer(req: Req$2): Promise<Livreur>;
}

type Req$1 = {
    commandeId: string;
};
type Resultat = {
    commande: Commande$1;
    livreur: Livreur;
};
declare class AttribuerLivraisonUseCase {
    private readonly depotCommandes;
    private readonly depotLivreurs;
    private readonly depotRestaurants;
    private readonly selectionLivreur;
    constructor(depotCommandes: DepotCommandes, depotLivreurs: DepotLivreurs, depotRestaurants: DepotRestaurants);
    executer(req: Req$1): Promise<Resultat>;
}

type Req = {
    commandeId: string;
    livreurId: string;
    pourboire?: number;
};
declare class TerminerLivraisonUseCase {
    private readonly depotCommandes;
    private readonly depotLivreurs;
    private readonly depotRestaurants;
    private readonly cartographie;
    constructor(depotCommandes: DepotCommandes, depotLivreurs: DepotLivreurs, depotRestaurants: DepotRestaurants, cartographie: ServiceCartographie);
    executer(req: Req): Promise<{
        livreur: Livreur;
        gains: Money;
    }>;
}

export { AccepterCommandeUseCase, AjouterAuPanierUseCase, AjouterPlatUseCase, AttribuerLivraisonUseCase, ChangerStatutLivreurUseCase, ConnexionUseCase, type DepotClients, type DepotCommandes, type DepotComptes, type DepotFactures, type DepotLivreurs, type DepotPlats, type DepotRestaurants, InscriptionUseCase, ListerCommandesRestaurantUseCase, ListerRestaurantsUseCase, MarquerCommandePreteUseCase, ModifierPlatUseCase, ModifierRestaurantUseCase, ObtenirMonRestaurantUseCase, PasserCommandeUseCase, PayerCommandeUseCase, RefuserCommandeUseCase, type ServiceCartographie, type ServicePaiement, SupprimerPlatUseCase, TerminerLivraisonUseCase, VoirMenuRestaurantUseCase };
