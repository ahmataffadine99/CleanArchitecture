"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InscriptionUseCase = void 0;
const domain_1 = require("@ecoeats/domain");
const domain_2 = require("@ecoeats/domain");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class InscriptionUseCase {
    depotComptes;
    depotClients;
    depotRestaurants;
    depotLivreurs;
    secretJwt;
    SALT_ROUNDS = 10;
    constructor(depotComptes, depotClients, depotRestaurants, depotLivreurs, secretJwt) {
        this.depotComptes = depotComptes;
        this.depotClients = depotClients;
        this.depotRestaurants = depotRestaurants;
        this.depotLivreurs = depotLivreurs;
        this.secretJwt = secretJwt;
    }
    async executer(req) {
        // Vérifier que l'email n'est pas déjà pris
        const existant = await this.depotComptes.trouverParEmail(req.email);
        if (existant)
            throw new domain_2.EmailDejaUtiliseError(req.email);
        // Hasher le mot de passe
        const motDePasseHache = await bcrypt_1.default.hash(req.motDePasse, this.SALT_ROUNDS);
        // Créer l'identifiant de profil (Client ou Restaurant)
        const profilId = (0, uuid_1.v4)();
        if (req.role === "CLIENT") {
            const client = new domain_1.Client(profilId, req.nom, req.email, req.adresse || "À renseigner", req.telephone);
            await this.depotClients.sauvegarder(client);
        }
        else if (req.role === "RESTAURATEUR") {
            // Créer un restaurant par défaut pour le restaurateur
            const restaurant = new domain_1.Restaurant(profilId, req.nom, // Nom de l'enseigne
            req.adresse || "Adresse à préciser", new domain_1.Coordonnees(req.latitude || 48.8566, req.longitude || 2.3522), profilId // Le profilId sert d'identifiant stable pour le dashboard
            );
            await this.depotRestaurants.sauvegarder(restaurant);
        }
        else if (req.role === "LIVREUR") {
            const livreur = new domain_1.Livreur(profilId, req.nom, new domain_1.Coordonnees(req.latitude || 48.8566, req.longitude || 2.3522), req.telephone || "À renseigner", false, // Pas expert par défaut
            domain_1.Money.zero() // Portefeuille vide au départ
            );
            await this.depotLivreurs.sauvegarder(livreur);
        }
        // Créer et sauvegarder le compte
        const compteId = (0, uuid_1.v4)();
        const compte = new domain_1.CompteUtilisateur(compteId, req.email, motDePasseHache, req.role, profilId);
        await this.depotComptes.sauvegarder(compte);
        // Générer le token JWT immédiatement pour connecter l'utilisateur
        const token = jsonwebtoken_1.default.sign({
            sub: compteId,
            role: compte.role,
            profilId: compte.profilId,
            email: compte.email,
        }, this.secretJwt, { expiresIn: "24h" });
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
exports.InscriptionUseCase = InscriptionUseCase;
//# sourceMappingURL=InscriptionUseCase.js.map