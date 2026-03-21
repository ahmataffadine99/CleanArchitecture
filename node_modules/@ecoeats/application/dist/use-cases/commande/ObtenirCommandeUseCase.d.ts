import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
export declare class ObtenirCommandeUseCase {
    private readonly depotCommandes;
    private readonly depotRestaurants;
    constructor(depotCommandes: DepotCommandes, depotRestaurants: DepotRestaurants);
    executer(commandeId: string): Promise<any>;
}
//# sourceMappingURL=ObtenirCommandeUseCase.d.ts.map