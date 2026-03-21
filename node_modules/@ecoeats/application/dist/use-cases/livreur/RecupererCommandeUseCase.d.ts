import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
type Req = {
    livreurId: string;
    commandeId: string;
};
export declare class RecupererCommandeUseCase {
    private readonly depotCommandes;
    private readonly depotLivreurs;
    constructor(depotCommandes: DepotCommandes, depotLivreurs: DepotLivreurs);
    executer(req: Req): Promise<void>;
}
export {};
//# sourceMappingURL=RecupererCommandeUseCase.d.ts.map