import "dotenv/config";
import express from "express";
import { creerRoutesClient } from "@ecoeats/interface";
import { creerRoutesRestaurant } from "@ecoeats/interface";
import { creerRoutesLivreur } from "@ecoeats/interface";
import { creerRoutesAuth } from "@ecoeats/interface";
import { gestionnaireErreurs } from "@ecoeats/interface";
import { creerAuthMiddleware, requireRole, routerAdmin, routerSupport } from "@ecoeats/interface";

// =====================================================================
// COMPOSITION ROOT — c'est ici qu'on choisit les adaptateurs à injecter
// Changer DB_ADAPTER=postgresql pour passer sur PostgreSQL
// =====================================================================
import {
  DepotCommandesEnMemoire, DepotRestaurantsEnMemoire, DepotPlatsEnMemoire,
  DepotClientsEnMemoire, DepotLivreursEnMemoire, DepotFacturesEnMemoire, DepotComptesEnMemoire,
  CartographieHaversine, PaiementSimule,
  DepotCommandesPrisma, DepotRestaurantsPrisma, DepotPlatsPrisma, DepotClientsPrisma, DepotLivreursPrisma, DepotComptesPrisma,
  DepotAvisPrisma, DepotFavorisPrisma, DepotTicketsPrisma, DepotTicketsEnMemoire
} from "@ecoeats/infrastructure";
import {
  ListerRestaurantsUseCase, VoirMenuRestaurantUseCase, AjouterAuPanierUseCase,
  PasserCommandeUseCase, PayerCommandeUseCase, AjouterPlatUseCase, ModifierPlatUseCase,
  SupprimerPlatUseCase, AccepterCommandeUseCase, RefuserCommandeUseCase,
  MarquerCommandePreteUseCase, ChangerStatutLivreurUseCase, AttribuerLivraisonUseCase,
  ProposerLivraisonUseCase, AccepterLivraisonUseCase, RefuserLivraisonUseCase, ObtenirPropositionsLivreurUseCase,
  TerminerLivraisonUseCase, ObtenirLivreurUseCase, InscriptionUseCase, ConnexionUseCase, ListerCommandesRestaurantUseCase,
  ModifierRestaurantUseCase, ObtenirMonRestaurantUseCase, ListerCommandesClientUseCase,
  RecupererCommandeUseCase, ObtenirCommandeUseCase, ListerHistoriqueLivreurUseCase,
  GererFavorisUseCase, LaisserAvisLivreurUseCase, ObtenirAvisLivreurUseCase,
  ObtenirFavorisDetailsUseCase, ObtenirStatsGlobalesUseCase,
  MettreAJourProfilClientUseCase,
  ObtenirProfilClientUseCase,
  ObtenirTousLesComptesUseCase,
  ChangerStatutCompteUseCase,
  ListerToutesLesCommandesUseCase,
  CreerTicketUseCase,
  EnvoyerMessageTicketUseCase,
  ListerTicketsUseCase,
  CloturerTicketUseCase,
  MarquerTicketCommeLuUseCase,
  ObtenirStatsRestaurantUseCase
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
const depotAvis        = utiliserPostgres ? new DepotAvisPrisma(prismaClient!)        : null as any;
const depotFavoris     = utiliserPostgres ? new DepotFavorisPrisma(prismaClient!)     : null as any;
const depotTickets     = utiliserPostgres ? new DepotTicketsPrisma(prismaClient!)     : new DepotTicketsEnMemoire();
const depotFactures    = new DepotFacturesEnMemoire();
const cartographie     = new CartographieHaversine();
const paiement         = new PaiementSimule();

// --- Instanciation des Use Cases ---
const listerRestaurants = new ListerRestaurantsUseCase(depotRestaurants);
const voirMenu          = new VoirMenuRestaurantUseCase(depotPlats);
const ajouterAuPanier   = new AjouterAuPanierUseCase(depotPlats, depotClients);
const passerCommande    = new PasserCommandeUseCase(depotCommandes, depotRestaurants, depotClients, depotPlats, cartographie);
const payerCommande     = new PayerCommandeUseCase(depotCommandes, depotFactures, paiement, depotClients);
const listerCommandesClient = new ListerCommandesClientUseCase(depotCommandes, depotRestaurants, depotLivreurs);
const gererFavoris      = new GererFavorisUseCase(depotFavoris);
const obtenirFavorisDet = new ObtenirFavorisDetailsUseCase(depotFavoris, depotRestaurants, depotPlats);
const laisserAvis       = new LaisserAvisLivreurUseCase(depotAvis, depotCommandes);
const mettreAJourProfil = new MettreAJourProfilClientUseCase(depotClients, depotComptes);
const obtenirProfilClient = new ObtenirProfilClientUseCase(depotClients);
const obtenirStats      = new ObtenirStatsGlobalesUseCase(depotCommandes, depotComptes, depotRestaurants, depotTickets, cartographie);
const obtenirTousComptes = new ObtenirTousLesComptesUseCase(depotComptes);
const changerStatutCompte = new ChangerStatutCompteUseCase(depotComptes);
const listerToutesLesCommandes = new ListerToutesLesCommandesUseCase(depotCommandes, depotClients, depotRestaurants);
const creerTicket = new CreerTicketUseCase(depotTickets);
const envoyerMessageTicket = new EnvoyerMessageTicketUseCase(depotTickets);
const listerTickets = new ListerTicketsUseCase(depotTickets);
const cloturerTicket = new CloturerTicketUseCase(depotTickets);
const marquerCommeLu = new MarquerTicketCommeLuUseCase(depotTickets);
const obtenirStatsRestaurant = new ObtenirStatsRestaurantUseCase(depotCommandes, depotRestaurants);

const ajouterPlat       = new AjouterPlatUseCase(depotPlats, depotRestaurants);
const modifierPlat      = new ModifierPlatUseCase(depotPlats);
const supprimerPlat     = new SupprimerPlatUseCase(depotPlats);
const proposerLivraison = new ProposerLivraisonUseCase(depotCommandes, depotLivreurs, depotRestaurants, cartographie);
const accepterCommande  = new AccepterCommandeUseCase(depotCommandes, proposerLivraison);
const refuserCommande   = new RefuserCommandeUseCase(depotCommandes);
const accepterLivraison = new AccepterLivraisonUseCase(depotCommandes, depotLivreurs);
const refuserLivraison  = new RefuserLivraisonUseCase(depotLivreurs);
const marquerPrete      = new MarquerCommandePreteUseCase(depotCommandes, proposerLivraison);
const listerCommandes   = new ListerCommandesRestaurantUseCase(depotCommandes, depotClients, depotLivreurs);
const modifierRestaurant = new ModifierRestaurantUseCase(depotRestaurants);
const obtenirMonResto   = new ObtenirMonRestaurantUseCase(depotRestaurants);

const changerStatut     = new ChangerStatutLivreurUseCase(depotLivreurs, depotCommandes, depotRestaurants, cartographie);
const obtenirLivreur    = new ObtenirLivreurUseCase(depotLivreurs);
const obtenirPropositions = new ObtenirPropositionsLivreurUseCase(depotLivreurs, depotCommandes, depotRestaurants, cartographie);
const attribuerLivraison = new AttribuerLivraisonUseCase(depotCommandes, depotLivreurs, depotRestaurants);
const terminerLivraison = new TerminerLivraisonUseCase(depotCommandes, depotLivreurs, depotRestaurants, cartographie);
const recupererCommande = new RecupererCommandeUseCase(depotCommandes, depotLivreurs);
const obtenirCommande   = new ObtenirCommandeUseCase(depotCommandes, depotRestaurants);
const listerHistoriqueLivreur = new ListerHistoriqueLivreurUseCase(depotCommandes, depotRestaurants);
const obtenirAvis       = new ObtenirAvisLivreurUseCase(depotAvis);

import cors from "cors";

// --- JWT Secret (en dur pour la démo, normalement dans .env) ---
const SECRET_JWT = process.env.JWT_SECRET || "mon_super_secret_jwt_hyper_securise";
const inscription       = new InscriptionUseCase(depotComptes, depotClients, depotRestaurants, depotLivreurs, SECRET_JWT);
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

// Routes ADMIN
app.use("/api/admin", requireAuth, requireRole("ADMIN"), routerAdmin(
  obtenirStats,
  obtenirTousComptes,
  changerStatutCompte,
  listerRestaurants,
  listerToutesLesCommandes,
  listerTickets,
  envoyerMessageTicket,
  cloturerTicket,
  marquerCommeLu,
  obtenirStatsRestaurant
));

// Routes SUPPORT (Client, Resto, Livreur)
app.use("/api/support", requireAuth, routerSupport(
  creerTicket,
  envoyerMessageTicket,
  listerTickets
));

// Routes publiques
app.use("/api", creerRoutesClient({ 
  listerRestaurants, 
  voirMenu, 
  ajouterAuPanier, 
  passerCommande, 
  payerCommande, 
  listerCommandesClient, 
  gererFavoris, 
  laisserAvis, 
  obtenirFavorisDetails: obtenirFavorisDet,
  mettreAJourProfil,
  obtenirProfil: obtenirProfilClient
}));

// Routes nécessitant une authentification
app.use("/api", requireAuth, (req, res, next) => {
  const restoPaths = ["/restaurant", "/plats", "/commandes"];
  const isRestoCommand = (req.path.includes("/accepter") || req.path.includes("/refuser") || req.path.includes("/prete")) && !req.path.includes("/livreurs");
  if (req.path.startsWith("/restaurant") || req.path.startsWith("/plats") || isRestoCommand) {
    return requireRole("RESTAURATEUR")(req, res, next);
  }
  next();
}, creerRoutesRestaurant({ ajouterPlat, modifierPlat, supprimerPlat, accepterCommande, refuserCommande, marquerPrete, listerCommandes, modifierRestaurant, obtenirMonResto, servicePanier: ajouterAuPanier }));

app.use("/api", requireAuth, (req, res, next) => {
  const isLivreurCommand = req.path.includes("/attribuer-livreur") || 
                           req.path.includes("/livree") || 
                           req.path.includes("/propositions") || 
                           req.path.includes("/recuperer") ||
                           (req.method === 'GET' && req.path.startsWith("/commandes/"));
  if (req.path.startsWith("/livreurs") || isLivreurCommand) {
    return requireRole("LIVREUR")(req, res, next);
  }
  next();
}, creerRoutesLivreur({ 
  changerStatut, 
  attribuerLivraison, 
  terminerLivraison, 
  obtenirLivreur,
  accepterLivraison,
  refuserLivraison,
  obtenirPropositions,
  recupererCommande,
  obtenirCommande,
  listerHistorique: listerHistoriqueLivreur,
  obtenirAvis,
}));

app.use(gestionnaireErreurs);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[EcoEATS - Express] Serveur démarré sur http://localhost:${PORT}`);
});

export default app;
