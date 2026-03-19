import { Livreur } from "@ecoeats/domain";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
type Req = {
    livreurId: string;
    statut: "DISPONIBLE" | "INDISPONIBLE";
};
export declare class ChangerStatutLivreurUseCase {
    private readonly depotLivreurs;
    constructor(depotLivreurs: DepotLivreurs);
    executer(req: Req): Promise<Livreur>;
}
export {};
//# sourceMappingURL=ChangerStatutLivreurUseCase.d.ts.map