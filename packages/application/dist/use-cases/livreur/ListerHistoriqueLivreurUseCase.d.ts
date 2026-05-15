import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
export declare class ListerHistoriqueLivreurUseCase {
    private readonly depotCommandes;
    private readonly depotRestaurants;
    constructor(depotCommandes: DepotCommandes, depotRestaurants: DepotRestaurants);
    executer(livreurId: string): Promise<any[]>;
}