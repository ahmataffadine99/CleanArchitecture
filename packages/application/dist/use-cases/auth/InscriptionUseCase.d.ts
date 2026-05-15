import { RoleUtilisateur } from "@ecoeats/domain";
import { DepotComptes } from "../../ports/DepotComptes";
import { DepotClients } from "../../ports/DepotClients";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
type Req = {
    nom: string;
    email: string;
    motDePasse: string;
    role: RoleUtilisateur;
    adresse?: string;
    telephone?: string;
    latitude?: number;
    longitude?: number;
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
    private readonly depotLivreurs;
    private readonly secretJwt;
    private readonly SALT_ROUNDS;
    constructor(depotComptes: DepotComptes, depotClients: DepotClients, depotRestaurants: DepotRestaurants, depotLivreurs: DepotLivreurs, secretJwt: string);
    executer(req: Req): Promise<Res>;
}
export {};