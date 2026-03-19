import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../ports/DepotCommandes";
type Req = {
    commandeId: string;
    tempsPreparationMinutes: number;
};
export declare class AccepterCommandeUseCase {
    private readonly depotCommandes;
    constructor(depotCommandes: DepotCommandes);
    executer(req: Req): Promise<Commande>;
}
export {};
//# sourceMappingURL=AccepterCommandeUseCase.d.ts.map