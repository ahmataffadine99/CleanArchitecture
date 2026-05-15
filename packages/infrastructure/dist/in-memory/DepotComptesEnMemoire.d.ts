import { CompteUtilisateur } from "@ecoeats/domain";
import { DepotComptes } from "@ecoeats/application";
export declare class DepotComptesEnMemoire implements DepotComptes {
    private readonly store;
    sauvegarder(compte: CompteUtilisateur): Promise<void>;
    trouverParEmail(email: string): Promise<CompteUtilisateur | null>;
    trouverParId(id: string): Promise<CompteUtilisateur | null>;
}