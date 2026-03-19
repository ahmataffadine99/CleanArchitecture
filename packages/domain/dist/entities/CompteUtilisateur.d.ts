export type RoleUtilisateur = "CLIENT" | "RESTAURATEUR" | "LIVREUR";
export declare class CompteUtilisateur {
    readonly id: string;
    readonly email: string;
    readonly motDePasseHache: string;
    readonly role: RoleUtilisateur;
    readonly profilId: string;
    constructor(id: string, email: string, motDePasseHache: string, role: RoleUtilisateur, profilId: string);
}
//# sourceMappingURL=CompteUtilisateur.d.ts.map