import { CompteUtilisateur, RoleUtilisateur, Client, Restaurant, Coordonnees, Livreur, Money } from "@ecoeats/domain";
import { EmailDejaUtiliseError } from "@ecoeats/domain";
import { DepotComptes } from "../../ports/DepotComptes";
import { DepotClients } from "../../ports/DepotClients";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export class InscriptionUseCase {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly depotComptes: DepotComptes,
    private readonly depotClients: DepotClients,
    private readonly depotRestaurants: DepotRestaurants,
    private readonly depotLivreurs: DepotLivreurs,
    private readonly secretJwt: string
  ) {}

  async executer(req: Req): Promise<Res> {
    const existant = await this.depotComptes.trouverParEmail(req.email);
    if (existant) throw new EmailDejaUtiliseError(req.email);

    const motDePasseHache = await bcrypt.hash(req.motDePasse, this.SALT_ROUNDS);

    const profilId = uuid();

    if (req.role === "CLIENT") {
      const client = new Client(profilId, req.nom, req.email, req.adresse || "À renseigner", req.telephone);
      await this.depotClients.sauvegarder(client);
    } else if (req.role === "RESTAURATEUR") {
      const restaurant = new Restaurant(
        profilId,
        req.nom,
        req.adresse || "Adresse à préciser",
        new Coordonnees(req.latitude || 48.8566, req.longitude || 2.3522),
        profilId
      );
      await this.depotRestaurants.sauvegarder(restaurant);
    } else if (req.role === "LIVREUR") {
      const livreur = new Livreur(
        profilId,
        req.nom,
        new Coordonnees(req.latitude || 48.8566, req.longitude || 2.3522),
        req.telephone || "À renseigner",
        false,
        Money.zero()
      );
      await this.depotLivreurs.sauvegarder(livreur);
    }

    const compteId = uuid();
    const compte = new CompteUtilisateur(
      compteId,
      req.email,
      motDePasseHache,
      req.role,
      profilId
    );
    await this.depotComptes.sauvegarder(compte);

    const token = jwt.sign(
      {
        sub: compteId,
        role: compte.role,
        profilId: compte.profilId,
        email: compte.email,
      },
      this.secretJwt,
      { expiresIn: "24h" }
    );

    return { 
      token, 
      user: {
        id: compteId,
        email: compte.email,
        role: compte.role,
        profilId: compte.profilId
      }
    };
  }
}
