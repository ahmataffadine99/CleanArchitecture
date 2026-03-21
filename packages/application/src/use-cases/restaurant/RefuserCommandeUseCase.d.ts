import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
export declare class RefuserCommandeUseCase {
    private readonly depotCommandes;
    constructor(depotCommandes: DepotCommandes);
    executer(commandeId: string): Promise<Commande>;
}
//# sourceMappingURL=RefuserCommandeUseCase.d.ts.map