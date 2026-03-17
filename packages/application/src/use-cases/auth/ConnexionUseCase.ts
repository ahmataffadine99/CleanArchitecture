import { IdentifiantsInvalidesError } from "@ecoeats/domain";
import { DepotComptes } from "../ports/DepotComptes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type Req = {
  email: string;
  motDePasse: string;
};

type Res = {
  token: string;
  role: string;
  profilId: string;
};

export class ConnexionUseCase {
  constructor(
    private readonly depotComptes: DepotComptes,
    private readonly secretJwt: string
  ) {}

  async executer(req: Req): Promise<Res> {
    // Trouver le compte par email
    const compte = await this.depotComptes.trouverParEmail(req.email);
    if (!compte) throw new IdentifiantsInvalidesError();

    // Vérifier le mot de passe contre le hash
    const motDePasseValide = await bcrypt.compare(req.motDePasse, compte.motDePasseHache);
    if (!motDePasseValide) throw new IdentifiantsInvalidesError();

    // Générer le token JWT avec les infos utiles
    const token = jwt.sign(
      {
        sub: compte.id,
        role: compte.role,
        profilId: compte.profilId,
        email: compte.email,
      },
      this.secretJwt,
      { expiresIn: "24h" }
    );

    return { token, role: compte.role, profilId: compte.profilId };
  }
}
