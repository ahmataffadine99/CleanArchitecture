import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "../../ports/DepotCommandes";
import { ProposerLivraisonUseCase } from "../livreur/ProposerLivraisonUseCase";
export declare class MarquerCommandePreteUseCase {
    private readonly depotCommandes;
    private readonly proposerLivraison;
    constructor(depotCommandes: DepotCommandes, proposerLivraison: ProposerLivraisonUseCase);
    executer(commandeId: string): Promise<Commande>;
}
//# sourceMappingURL=MarquerCommandePreteUseCase.d.ts.map