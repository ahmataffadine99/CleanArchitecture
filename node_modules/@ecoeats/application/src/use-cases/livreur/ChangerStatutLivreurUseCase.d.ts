import { Livreur } from "@ecoeats/domain";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { DepotCommandes } from "../../ports/DepotCommandes";
type Req = {
    livreurId: string;
    statut: "DISPONIBLE" | "INDISPONIBLE";
};
import { DepotRestaurants } from "../../ports/DepotRestaurants";
import { ServiceCartographie } from "../../ports/ServiceCartographie";
export declare class ChangerStatutLivreurUseCase {
    private readonly depotLivreurs;
    private readonly depotCommandes;
    private readonly depotRestaurants;
    private readonly cartographie;
    private readonly RAYON_ACTION_KM;
    constructor(depotLivreurs: DepotLivreurs, depotCommandes: DepotCommandes, depotRestaurants: DepotRestaurants, cartographie: ServiceCartographie);
    executer(req: Req): Promise<Livreur>;
}
export {};
//# sourceMappingURL=ChangerStatutLivreurUseCase.d.ts.map