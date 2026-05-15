export type RoleUtilisateur = "CLIENT" | "RESTAURATEUR" | "LIVREUR" | "ADMIN";

export class CompteUtilisateur {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly motDePasseHache: string,
    public readonly role: RoleUtilisateur,
    public readonly profilId: string,
    public readonly estActif: boolean = true,
    public readonly creeLe: Date = new Date()
  ) {}
}
