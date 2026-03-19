import { CompteUtilisateur, RoleUtilisateur, Client, Restaurant, Coordonnees } from "@ecoeats/domain";
import { EmailDejaUtiliseError } from "@ecoeats/domain";
import { DepotComptes } from "../../ports/DepotComptes";
import { DepotClients } from "../../ports/DepotClients";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type Req = {
  nom: string;
  email: string;
  motDePasse: string;
  role: RoleUtilisateur;
  adresse?: string; // Utilisé pour le restaurant
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
    private readonly secretJwt: string
  ) {}

  async executer(req: Req): Promise<Res> {
    // Vérifier que l'email n'est pas déjà pris
    const existant = await this.depotComptes.trouverParEmail(req.email);
    if (existant) throw new EmailDejaUtiliseError(req.email);

    // Hasher le mot de passe
    const motDePasseHache = await bcrypt.hash(req.motDePasse, this.SALT_ROUNDS);

    // Créer l'identifiant de profil (Client ou Restaurant)
    const profilId = uuid();

    if (req.role === "CLIENT") {
      const client = new Client(profilId, req.nom, req.email, "À renseigner");
      await this.depotClients.sauvegarder(client);
    } else if (req.role === "RESTAURATEUR") {
      // Créer un restaurant par défaut pour le restaurateur
      const restaurant = new Restaurant(
        profilId,
        req.nom, // Nom de l'enseigne
        req.adresse || "Adresse à préciser",
        new Coordonnees(48.8566, 2.3522), // Paris par défaut
        profilId // Le profilId sert d'identifiant stable pour le dashboard
      );
      await this.depotRestaurants.sauvegarder(restaurant);
    }

    // Créer et sauvegarder le compte
    const compteId = uuid();
    const compte = new CompteUtilisateur(
      compteId,
      req.email,
      motDePasseHache,
      req.role,
      profilId
    );
    await this.depotComptes.sauvegarder(compte);

    // Générer le token JWT immédiatement pour connecter l'utilisateur
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
