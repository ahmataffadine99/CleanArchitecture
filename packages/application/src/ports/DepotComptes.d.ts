import { CompteUtilisateur } from "@ecoeats/domain";
export interface DepotComptes {
    sauvegarder(compte: CompteUtilisateur): Promise<void>;
    trouverParEmail(email: string): Promise<CompteUtilisateur | null>;
    trouverParId(id: string): Promise<CompteUtilisateur | null>;
}
//# sourceMappingURL=DepotComptes.d.ts.map