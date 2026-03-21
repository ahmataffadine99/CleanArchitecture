import { DepotAvis } from "../../ports/DepotAvis";
import { DepotCommandes } from "../../ports/DepotCommandes";
export declare class LaisserAvisLivreurUseCase {
    private readonly depotAvis;
    private readonly depotCommandes;
    constructor(depotAvis: DepotAvis, depotCommandes: DepotCommandes);
    executer(params: {
        commandeId: string;
        note: number;
        commentaire?: string;
    }): Promise<void>;
}
//# sourceMappingURL=LaisserAvisLivreurUseCase.d.ts.map