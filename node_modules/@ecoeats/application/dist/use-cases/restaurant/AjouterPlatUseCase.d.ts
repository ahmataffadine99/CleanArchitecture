import { PlatMenu } from "@ecoeats/domain";
import { DepotPlats } from "../../ports/DepotPlats";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
type Req = {
    restaurantId: string;
    nom: string;
    description: string;
    prixEuros: number;
    allergenes: string[];
    stockJournalier: number;
    imageUrl?: string;
    actif?: boolean;
    categorie?: string;
};
export declare class AjouterPlatUseCase {
    private readonly depotPlats;
    private readonly depotRestaurants;
    constructor(depotPlats: DepotPlats, depotRestaurants: DepotRestaurants);
    executer(req: Req): Promise<PlatMenu>;
}
export {};
//# sourceMappingURL=AjouterPlatUseCase.d.ts.map