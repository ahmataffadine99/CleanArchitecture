import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../ports/DepotCommandes";
export declare class MarquerCommandePreteUseCase {
    private readonly depotCommandes;
    constructor(depotCommandes: DepotCommandes);
    executer(commandeId: string): Promise<Commande>;
}
//# sourceMappingURL=MarquerCommandePreteUseCase.d.ts.map