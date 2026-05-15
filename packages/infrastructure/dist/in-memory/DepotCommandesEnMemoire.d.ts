import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "@ecoeats/application";
export declare class DepotCommandesEnMemoire implements DepotCommandes {
    private readonly store;
    sauvegarder(commande: Commande): Promise<void>;
    trouverParId(id: string): Promise<Commande>;
    trouverParRestaurant(restaurantId: string): Promise<Commande[]>;
    trouverParClient(clientId: string): Promise<Commande[]>;
    trouverParLivreur(livreurId: string): Promise<Commande[]>;
    trouverTout(): Promise<Commande[]>;
    trouverCommandesSansLivreur(): Promise<Commande[]>;
}