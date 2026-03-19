import { DepotRestaurants } from "../../ports/DepotRestaurants";
type Req = {
    restaurantId: string;
    nom?: string;
    adresse?: string;
    imageUrl?: string | null;
    latitude?: number;
    longitude?: number;
};
export declare class ModifierRestaurantUseCase {
    private readonly depotRestaurants;
    constructor(depotRestaurants: DepotRestaurants);
    executer(req: Req): Promise<void>;
}
export {};
//# sourceMappingURL=ModifierRestaurantUseCase.d.ts.map