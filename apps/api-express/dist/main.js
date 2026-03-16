"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);
var import_express = __toESM(require("express"));
var import_interface = require("@ecoeats/interface");
var import_interface2 = require("@ecoeats/interface");
var import_interface3 = require("@ecoeats/interface");
var import_interface4 = require("@ecoeats/interface");
var import_infrastructure = require("@ecoeats/infrastructure");
var import_application = require("@ecoeats/application");
var utiliserPostgres = process.env.DB_ADAPTER === "postgresql";
console.log(`[Config] Adaptateur DB : ${utiliserPostgres ? "PostgreSQL (Prisma)" : "In-Memory"}`);
var depotCommandes = utiliserPostgres ? new import_infrastructure.DepotCommandesPrisma(null) : new import_infrastructure.DepotCommandesEnMemoire();
var depotRestaurants = utiliserPostgres ? new import_infrastructure.DepotRestaurantsPrisma(null) : new import_infrastructure.DepotRestaurantsEnMemoire();
var depotPlats = utiliserPostgres ? new import_infrastructure.DepotPlatsPrisma(null) : new import_infrastructure.DepotPlatsEnMemoire();
var depotClients = new import_infrastructure.DepotClientsEnMemoire();
var depotLivreurs = utiliserPostgres ? new import_infrastructure.DepotLivreursPrisma(null) : new import_infrastructure.DepotLivreursEnMemoire();
var depotFactures = new import_infrastructure.DepotFacturesEnMemoire();
var cartographie = new import_infrastructure.CartographieHaversine();
var paiement = new import_infrastructure.PaiementSimule();
var listerRestaurants = new import_application.ListerRestaurantsUseCase(depotRestaurants);
var voirMenu = new import_application.VoirMenuRestaurantUseCase(depotPlats);
var ajouterAuPanier = new import_application.AjouterAuPanierUseCase(depotPlats, depotClients);
var passerCommande = new import_application.PasserCommandeUseCase(depotCommandes, depotRestaurants, depotClients, depotPlats, cartographie);
var payerCommande = new import_application.PayerCommandeUseCase(depotCommandes, depotFactures, paiement);
var ajouterPlat = new import_application.AjouterPlatUseCase(depotPlats, depotRestaurants);
var modifierPlat = new import_application.ModifierPlatUseCase(depotPlats);
var supprimerPlat = new import_application.SupprimerPlatUseCase(depotPlats);
var accepterCommande = new import_application.AccepterCommandeUseCase(depotCommandes);
var refuserCommande = new import_application.RefuserCommandeUseCase(depotCommandes);
var marquerPrete = new import_application.MarquerCommandePreteUseCase(depotCommandes);
var changerStatut = new import_application.ChangerStatutLivreurUseCase(depotLivreurs);
var attribuerLivraison = new import_application.AttribuerLivraisonUseCase(depotCommandes, depotLivreurs, depotRestaurants);
var terminerLivraison = new import_application.TerminerLivraisonUseCase(depotCommandes, depotLivreurs, depotRestaurants, cartographie);
var app = (0, import_express.default)();
app.use(import_express.default.json());
app.get("/health", (_req, res) => res.json({ status: "ok", adapter: utiliserPostgres ? "postgresql" : "in-memory" }));
app.use("/api", (0, import_interface.creerRoutesClient)({ listerRestaurants, voirMenu, ajouterAuPanier, passerCommande, payerCommande }));
app.use("/api", (0, import_interface2.creerRoutesRestaurant)({ ajouterPlat, modifierPlat, supprimerPlat, accepterCommande, refuserCommande, marquerPrete }));
app.use("/api", (0, import_interface3.creerRoutesLivreur)({ changerStatut, attribuerLivraison, terminerLivraison }));
app.use(import_interface4.gestionnaireErreurs);
var PORT = process.env.PORT || 3e3;
app.listen(PORT, () => {
  console.log(`[EcoEATS - Express] Serveur d\xE9marr\xE9 sur http://localhost:${PORT}`);
});
var main_default = app;
