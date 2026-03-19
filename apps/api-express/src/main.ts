import "dotenv/config";
import express from "express";
import { creerRoutesClient } from "@ecoeats/interface";
import { creerRoutesRestaurant } from "@ecoeats/interface";
import { creerRoutesLivreur } from "@ecoeats/interface";
import { creerRoutesAuth } from "@ecoeats/interface";
import { gestionnaireErreurs } from "@ecoeats/interface";
import { creerAuthMiddleware, requireRole } from "@ecoeats/interface";

// =====================================================================
// COMPOSITION ROOT — c'est ici qu'on choisit les adaptateurs à injecter
// Changer DB_ADAPTER=postgresql pour passer sur PostgreSQL
// =====================================================================
import {
  DepotCommandesEnMemoire, DepotRestaurantsEnMemoire, DepotPlatsEnMemoire,
  DepotClientsEnMemoire, DepotLivreursEnMemoire, DepotFacturesEnMemoire, DepotComptesEnMemoire,
  CartographieHaversine, PaiementSimule,
  DepotCommandesPrisma, DepotRestaurantsPrisma, DepotPlatsPrisma, DepotClientsPrisma, DepotLivreursPrisma, DepotComptesPrisma
} from "@ecoeats/infrastructure";
import {
  ListerRestaurantsUseCase, VoirMenuRestaurantUseCase, AjouterAuPanierUseCase,
  PasserCommandeUseCase, PayerCommandeUseCase, AjouterPlatUseCase, ModifierPlatUseCase,
  SupprimerPlatUseCase, AccepterCommandeUseCase, RefuserCommandeUseCase,
  MarquerCommandePreteUseCase, ChangerStatutLivreurUseCase, AttribuerLivraisonUseCase,
  TerminerLivraisonUseCase, InscriptionUseCase, ConnexionUseCase, ListerCommandesRestaurantUseCase,
  ModifierRestaurantUseCase, ObtenirMonRestaurantUseCase, ListerCommandesClientUseCase
} from "@ecoeats/application";

import { PrismaClient } from "@prisma/client";

const utiliserPostgres = process.env.DB_ADAPTER === "postgresql";

console.log(`[Config] Adaptateur DB : ${utiliserPostgres ? "PostgreSQL (Prisma)" : "In-Memory"}`);

const prismaClient = utiliserPostgres ? new PrismaClient() : null;

// --- Sélection des adaptateurs ---
const depotCommandes   = utiliserPostgres ? new DepotCommandesPrisma(prismaClient!)   : new DepotCommandesEnMemoire();
const depotRestaurants = utiliserPostgres ? new DepotRestaurantsPrisma(prismaClient!) : new DepotRestaurantsEnMemoire();
const depotPlats       = utiliserPostgres ? new DepotPlatsPrisma(prismaClient!)       : new DepotPlatsEnMemoire();
const depotClients     = utiliserPostgres ? new DepotClientsPrisma(prismaClient!)     : new DepotClientsEnMemoire();
const depotLivreurs    = utiliserPostgres ? new DepotLivreursPrisma(prismaClient!)    : new DepotLivreursEnMemoire();
const depotComptes     = utiliserPostgres ? new DepotComptesPrisma(prismaClient!)     : new DepotComptesEnMemoire();
const depotFactures    = new DepotFacturesEnMemoire();
const cartographie     = new CartographieHaversine();
const paiement         = new PaiementSimule();

// --- Instanciation des Use Cases ---
const listerRestaurants = new ListerRestaurantsUseCase(depotRestaurants);
const voirMenu          = new VoirMenuRestaurantUseCase(depotPlats);
const ajouterAuPanier   = new AjouterAuPanierUseCase(depotPlats, depotClients);
const passerCommande    = new PasserCommandeUseCase(depotCommandes, depotRestaurants, depotClients, depotPlats, cartographie);
const payerCommande     = new PayerCommandeUseCase(depotCommandes, depotFactures, paiement, depotClients);
const listerCommandesClient = new ListerCommandesClientUseCase(depotCommandes);

const ajouterPlat       = new AjouterPlatUseCase(depotPlats, depotRestaurants);
const modifierPlat      = new ModifierPlatUseCase(depotPlats);
const supprimerPlat     = new SupprimerPlatUseCase(depotPlats);
const accepterCommande  = new AccepterCommandeUseCase(depotCommandes);
const refuserCommande   = new RefuserCommandeUseCase(depotCommandes);
const marquerPrete      = new MarquerCommandePreteUseCase(depotCommandes);
const listerCommandes   = new ListerCommandesRestaurantUseCase(depotCommandes, depotClients);
const modifierRestaurant = new ModifierRestaurantUseCase(depotRestaurants);
const obtenirMonResto   = new ObtenirMonRestaurantUseCase(depotRestaurants);

const changerStatut     = new ChangerStatutLivreurUseCase(depotLivreurs);
const attribuerLivraison = new AttribuerLivraisonUseCase(depotCommandes, depotLivreurs, depotRestaurants);
const terminerLivraison = new TerminerLivraisonUseCase(depotCommandes, depotLivreurs, depotRestaurants, cartographie);

import cors from "cors";

// --- JWT Secret (en dur pour la démo, normalement dans .env) ---
const SECRET_JWT = process.env.JWT_SECRET || "mon_super_secret_jwt_hyper_securise";
const inscription       = new InscriptionUseCase(depotComptes, depotClients, depotRestaurants, SECRET_JWT);
const connexion         = new ConnexionUseCase(depotComptes, SECRET_JWT);

// --- Serveur Express ---
const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const requireAuth = creerAuthMiddleware(SECRET_JWT);

app.get("/health", (_req, res) => res.json({ status: "ok", adapter: utiliserPostgres ? "postgresql" : "in-memory" }));

app.use("/api/auth", creerRoutesAuth({ inscription, connexion }));

// Routes publiques (et accès client autorisé via le middleware si besoin dans le controller - ici c'est ouvert pour simplification vu que le Front vérifie. Mais idéalement les commandes client demandent auth)
app.use("/api", creerRoutesClient({ listerRestaurants, voirMenu, ajouterAuPanier, passerCommande, payerCommande, listerCommandesClient }));

// Routes nécessitant une authentification
app.use("/api", requireAuth, requireRole("RESTAURATEUR"), creerRoutesRestaurant({ ajouterPlat, modifierPlat, supprimerPlat, accepterCommande, refuserCommande, marquerPrete, listerCommandes, modifierRestaurant, obtenirMonResto, servicePanier: ajouterAuPanier }));
app.use("/api", requireAuth, creerRoutesLivreur({ changerStatut, attribuerLivraison, terminerLivraison }));

app.use(gestionnaireErreurs);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[EcoEATS - Express] Serveur démarré sur http://localhost:${PORT}`);
});

export default app;
