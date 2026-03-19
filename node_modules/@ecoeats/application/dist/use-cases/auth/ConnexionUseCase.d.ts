import { DepotComptes } from "../ports/DepotComptes";
type Req = {
    email: string;
    motDePasse: string;
};
type Res = {
    token: string;
    role: string;
    profilId: string;
};
export declare class ConnexionUseCase {
    private readonly depotComptes;
    private readonly secretJwt;
    constructor(depotComptes: DepotComptes, secretJwt: string);
    executer(req: Req): Promise<Res>;
}
export {};
//# sourceMappingURL=ConnexionUseCase.d.ts.map