import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { ProposerLivraisonUseCase } from "../livreur/ProposerLivraisonUseCase";
type Req = {
    commandeId: string;
    tempsPreparationMinutes: number;
};
export declare class AccepterCommandeUseCase {
    private readonly depotCommandes;
    private readonly proposerLivraison;
    constructor(depotCommandes: DepotCommandes, proposerLivraison: ProposerLivraisonUseCase);
    executer(req: Req): Promise<Commande>;
}
export {};
//# sourceMappingURL=AccepterCommandeUseCase.d.ts.map