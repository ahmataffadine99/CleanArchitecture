import { PlatMenu } from "@ecoeats/domain";
import { DepotPlats } from "../../ports/DepotPlats";
type Resultat = {
    disponibles: PlatMenu[];
    rupture: PlatMenu[];
};
export declare class VoirMenuRestaurantUseCase {
    private readonly depotPlats;
    constructor(depotPlats: DepotPlats);
    executer(restaurantId: string): Promise<Resultat>;
}
export {};
//# sourceMappingURL=VoirMenuRestaurantUseCase.d.ts.map