import { DepotPlats } from "../../ports/DepotPlats";
export declare class SupprimerPlatUseCase {
    private readonly depotPlats;
    constructor(depotPlats: DepotPlats);
    executer(platId: string): Promise<void>;
}
//# sourceMappingURL=SupprimerPlatUseCase.d.ts.map