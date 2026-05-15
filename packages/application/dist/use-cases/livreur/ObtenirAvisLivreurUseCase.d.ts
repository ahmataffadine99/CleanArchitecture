import { Avis } from "@ecoeats/domain";
import { DepotAvis } from "../../ports/DepotAvis";
export declare class ObtenirAvisLivreurUseCase {
    private readonly depotAvis;
    constructor(depotAvis: DepotAvis);
    executer(livreurId: string): Promise<Avis[]>;
}