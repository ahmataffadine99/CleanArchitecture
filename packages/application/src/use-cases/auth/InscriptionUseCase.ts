import { CompteUtilisateur, RoleUtilisateur } from "@ecoeats/domain";
import { EmailDejaUtiliseError } from "@ecoeats/domain";
import { DepotComptes } from "../ports/DepotComptes";
import { DepotClients } from "../ports/DepotClients";
import { Client } from "@ecoeats/domain";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

type Req = {
  nom: string;
  email: string;
  motDePasse: string;
  role: RoleUtilisateur;
};

type Res = {
  compte: CompteUtilisateur;
};

export class InscriptionUseCase {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly depotComptes: DepotComptes,
    private readonly depotClients: DepotClients
  ) {}

  async executer(req: Req): Promise<Res> {
    // Vérifier que l'email n'est pas déjà pris
    const existant = await this.depotComptes.trouverParEmail(req.email);
    if (existant) throw new EmailDejaUtiliseError(req.email);

    // Hasher le mot de passe
    const motDePasseHache = await bcrypt.hash(req.motDePasse, this.SALT_ROUNDS);

    // Créer les données métier associées selon le rôle
    const profilId = uuid();

    if (req.role === "CLIENT") {
      const client = new Client(profilId, req.nom, req.email, "À renseigner");
      await this.depotClients.sauvegarder(client);
    }
    // Restaurateur et Livreur : on crée juste le profil minimal (à enrichir ultérieurement)

    // Créer et sauvegarder le compte
    const compte = new CompteUtilisateur(
      uuid(),
      req.email,
      motDePasseHache,
      req.role,
      profilId
    );
    await this.depotComptes.sauvegarder(compte);

    return { compte };
  }
}
