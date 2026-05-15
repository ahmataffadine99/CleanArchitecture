import { DepotLivreurs } from "../../ports/DepotLivreurs";
type Req = {
    livreurId: string;
    commandeId: string;
};
export declare class RefuserLivraisonUseCase {
    private readonly depotLivreurs;
    constructor(depotLivreurs: DepotLivreurs);
    executer(req: Req): Promise<void>;
}
export {};