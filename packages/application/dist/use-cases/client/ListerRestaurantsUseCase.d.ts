import { Restaurant } from "@ecoeats/domain";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
export declare class ListerRestaurantsUseCase {
    private readonly depotRestaurants;
    constructor(depotRestaurants: DepotRestaurants);
    executer(): Promise<Restaurant[]>;
}
//# sourceMappingURL=ListerRestaurantsUseCase.d.ts.map