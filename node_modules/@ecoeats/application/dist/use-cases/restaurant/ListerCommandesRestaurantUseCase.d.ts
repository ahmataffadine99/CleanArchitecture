import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotClients } from "../../ports/DepotClients";
export declare class ListerCommandesRestaurantUseCase {
    private readonly depotCommandes;
    private readonly depotClients?;
    constructor(depotCommandes: DepotCommandes, depotClients?: DepotClients | undefined);
    executer(restaurantId: string): Promise<any[]>;
}
//# sourceMappingURL=ListerCommandesRestaurantUseCase.d.ts.map