import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
export declare class ListerCommandesClientUseCase {
    private readonly depotCommandes;
    private readonly depotRestaurants;
    private readonly depotLivreurs;
    constructor(depotCommandes: DepotCommandes, depotRestaurants: DepotRestaurants, depotLivreurs: DepotLivreurs);
    executer(clientId: string): Promise<any[]>;
}