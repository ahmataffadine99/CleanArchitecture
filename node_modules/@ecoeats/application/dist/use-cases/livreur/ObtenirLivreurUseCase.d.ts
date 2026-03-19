import { Livreur } from "@ecoeats/domain";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
export declare class ObtenirLivreurUseCase {
    private readonly depotLivreurs;
    constructor(depotLivreurs: DepotLivreurs);
    executer(livreurId: string): Promise<Livreur>;
}
//# sourceMappingURL=ObtenirLivreurUseCase.d.ts.map