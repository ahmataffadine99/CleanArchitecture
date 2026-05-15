import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotClients } from "../../ports/DepotClients";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
export declare class ListerCommandesRestaurantUseCase {
    private readonly depotCommandes;
    private readonly depotClients?;
    private readonly depotLivreurs?;
    constructor(depotCommandes: DepotCommandes, depotClients?: DepotClients | undefined, depotLivreurs?: DepotLivreurs | undefined);
    executer(restaurantId: string): Promise<any[]>;
}