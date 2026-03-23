// Représente un compte utilisateur (séparé de Client/Livreur/Proprietaire)
export type RoleUtilisateur = "CLIENT" | "RESTAURATEUR" | "LIVREUR" | "ADMIN";

export class CompteUtilisateur {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly motDePasseHache: string,
    public readonly role: RoleUtilisateur,
    public readonly profilId: string, // id du Client, Livreur ou Restaurant associé
    public readonly estActif: boolean = true,
    public readonly creeLe: Date = new Date()
  ) {}
}
