import { Livreur } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
type Req = {
    commandeId: string;
};
import { ServiceCartographie } from "../../ports/ServiceCartographie";
export declare class ProposerLivraisonUseCase {
    private readonly depotCommandes;
    private readonly depotLivreurs;
    private readonly depotRestaurants;
    private readonly cartographie;
    private readonly RAYON_ACTION_KM;
    constructor(depotCommandes: DepotCommandes, depotLivreurs: DepotLivreurs, depotRestaurants: DepotRestaurants, cartographie: ServiceCartographie);
    executer(req: Req): Promise<Livreur>;
}
export {};