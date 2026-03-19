import { Panier } from "@ecoeats/domain";
import { DepotPlats } from "../../ports/DepotPlats";
import { DepotClients } from "../../ports/DepotClients";
type Commande = {
    clientId: string;
    platId: string;
    quantite: number;
};
export declare class AjouterAuPanierUseCase {
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
export {};
//# sourceMappingURL=AjouterAuPanierUseCase.d.ts.map