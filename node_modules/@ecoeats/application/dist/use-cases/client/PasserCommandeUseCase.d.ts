import { Commande } from "@ecoeats/domain";
import { Panier } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
import { DepotClients } from "../../ports/DepotClients";
import { DepotPlats } from "../../ports/DepotPlats";
import { ServiceCartographie } from "../../ports/ServiceCartographie";
type Req = {
    clientId: string;
    panier: Panier;
    adresseLivraison: string;
};
export declare class PasserCommandeUseCase {
    private readonly depotCommandes;
    private readonly depotRestaurants;
    private readonly depotClients;
    private readonly depotPlats;
    private readonly cartographie;
    private readonly calculPrix;
    constructor(depotCommandes: DepotCommandes, depotRestaurants: DepotRestaurants, depotClients: DepotClients, depotPlats: DepotPlats, cartographie: ServiceCartographie);
    executer(req: Req): Promise<Commande>;
}
export {};
//# sourceMappingURL=PasserCommandeUseCase.d.ts.map