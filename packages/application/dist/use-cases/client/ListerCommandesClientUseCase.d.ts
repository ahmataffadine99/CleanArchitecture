import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
export declare class ListerCommandesClientUseCase {
    private readonly depotCommandes;
    constructor(depotCommandes: DepotCommandes);
    executer(clientId: string): Promise<Commande[]>;
}
//# sourceMappingURL=ListerCommandesClientUseCase.d.ts.map