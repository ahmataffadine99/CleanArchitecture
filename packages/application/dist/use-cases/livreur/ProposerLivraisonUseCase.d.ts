import { Livreur } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
type Req = {
    commandeId: string;
};
export declare class ProposerLivraisonUseCase {
    private readonly depotCommandes;
    private readonly depotLivreurs;
    private readonly depotRestaurants;
    private readonly selectionLivreur;
    constructor(depotCommandes: DepotCommandes, depotLivreurs: DepotLivreurs, depotRestaurants: DepotRestaurants);
    executer(req: Req): Promise<Livreur>;
}
export {};
//# sourceMappingURL=ProposerLivraisonUseCase.d.ts.map