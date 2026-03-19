import { Commande } from "@ecoeats/domain";
export interface DepotCommandes {
    sauvegarder(commande: Commande): Promise<void>;
    trouverParId(id: string): Promise<Commande>;
    trouverParRestaurant(restaurantId: string): Promise<Commande[]>;
    trouverParClient(clientId: string): Promise<Commande[]>;
    trouverTout(): Promise<Commande[]>;
}
//# sourceMappingURL=DepotCommandes.d.ts.map