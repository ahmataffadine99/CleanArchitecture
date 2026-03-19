import { Restaurant } from "@ecoeats/domain";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
export declare class ObtenirMonRestaurantUseCase {
    private readonly depotRestaurants;
    constructor(depotRestaurants: DepotRestaurants);
    executer(proprietaireId: string): Promise<Restaurant | null>;
}
//# sourceMappingURL=ObtenirMonRestaurantUseCase.d.ts.map