import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
export declare class ListerCommandesRestaurantUseCase {
    private readonly depotCommandes;
    constructor(depotCommandes: DepotCommandes);
    executer(restaurantId: string): Promise<Commande[]>;
}
//# sourceMappingURL=ListerCommandesRestaurantUseCase.d.ts.map