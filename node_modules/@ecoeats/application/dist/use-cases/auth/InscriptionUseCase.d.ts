import { RoleUtilisateur } from "@ecoeats/domain";
import { DepotComptes } from "../../ports/DepotComptes";
import { DepotClients } from "../../ports/DepotClients";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
type Req = {
    nom: string;
    email: string;
    motDePasse: string;
    role: RoleUtilisateur;
    adresse?: string;
    telephone?: string;
};
type Res = {
    token: string;
    user: {
        id: string;
        email: string;
        role: string;
        profilId: string;
    };
};
export declare class InscriptionUseCase {
    private readonly depotComptes;
    private readonly depotClients;
    private readonly depotRestaurants;
    private readonly secretJwt;
    private readonly SALT_ROUNDS;
    constructor(depotComptes: DepotComptes, depotClients: DepotClients, depotRestaurants: DepotRestaurants, secretJwt: string);
    executer(req: Req): Promise<Res>;
}
export {};
//# sourceMappingURL=InscriptionUseCase.d.ts.map