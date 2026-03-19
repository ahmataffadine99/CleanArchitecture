import { Livreur, Money } from "@ecoeats/domain";
import { DepotCommandes } from "../ports/DepotCommandes";
import { DepotLivreurs } from "../ports/DepotLivreurs";
import { ServiceCartographie } from "../ports/ServiceCartographie";
import { DepotRestaurants } from "../ports/DepotRestaurants";
type Req = {
    commandeId: string;
    livreurId: string;
    pourboire?: number;
};
export declare class TerminerLivraisonUseCase {
    private readonly depotCommandes;
    private readonly depotLivreurs;
    private readonly depotRestaurants;
    private readonly cartographie;
    constructor(depotCommandes: DepotCommandes, depotLivreurs: DepotLivreurs, depotRestaurants: DepotRestaurants, cartographie: ServiceCartographie);
    executer(req: Req): Promise<{
        livreur: Livreur;
        gains: Money;
    }>;
}
export {};
//# sourceMappingURL=TerminerLivraisonUseCase.d.ts.map