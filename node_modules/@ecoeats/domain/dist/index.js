"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ArticlePanier: () => ArticlePanier,
  AucunLivreurDisponibleError: () => AucunLivreurDisponibleError,
  CalculDistanceService: () => CalculDistanceService,
  CalculPrixService: () => CalculPrixService,
  Client: () => Client,
  ClientIntrouvableError: () => ClientIntrouvableError,
  Commande: () => Commande,
  CommandeIntrouvableError: () => CommandeIntrouvableError,
  Coordonnees: () => Coordonnees,
  ErreurMetier: () => ErreurMetier,
  Facture: () => Facture,
  Livreur: () => Livreur,
  Money: () => Money,
  Panier: () => Panier,
  PanierConflitRestaurantError: () => PanierConflitRestaurantError,
  PlatEnRuptureError: () => PlatEnRuptureError,
  PlatIntrouvableError: () => PlatIntrouvableError,
  PlatMenu: () => PlatMenu,
  Restaurant: () => Restaurant,
  RestaurantIntrouvableError: () => RestaurantIntrouvableError,
  SelectionLivreurService: () => SelectionLivreurService,
  StatutCommande: () => StatutCommande,
  StatutLivreur: () => StatutLivreur,
  TransitionStatutInvalideError: () => TransitionStatutInvalideError,
  transitionAutorisee: () => transitionAutorisee
});
module.exports = __toCommonJS(index_exports);

// src/value-objects/StatutCommande.ts
var StatutCommande = /* @__PURE__ */ ((StatutCommande2) => {
  StatutCommande2["EN_ATTENTE"] = "EN_ATTENTE";
  StatutCommande2["PAYEE"] = "PAYEE";
  StatutCommande2["ACCEPTEE"] = "ACCEPTEE";
  StatutCommande2["REFUSEE"] = "REFUSEE";
  StatutCommande2["EN_PREPARATION"] = "EN_PREPARATION";
  StatutCommande2["PRETE"] = "PRETE";
  StatutCommande2["EN_LIVRAISON"] = "EN_LIVRAISON";
  StatutCommande2["LIVREE"] = "LIVREE";
  return StatutCommande2;
})(StatutCommande || {});
var TRANSITIONS_AUTORISEES = {
  ["EN_ATTENTE" /* EN_ATTENTE */]: ["PAYEE" /* PAYEE */],
  ["PAYEE" /* PAYEE */]: ["ACCEPTEE" /* ACCEPTEE */, "REFUSEE" /* REFUSEE */],
  ["ACCEPTEE" /* ACCEPTEE */]: ["EN_PREPARATION" /* EN_PREPARATION */],
  ["EN_PREPARATION" /* EN_PREPARATION */]: ["PRETE" /* PRETE */],
  ["PRETE" /* PRETE */]: ["EN_LIVRAISON" /* EN_LIVRAISON */],
  ["EN_LIVRAISON" /* EN_LIVRAISON */]: ["LIVREE" /* LIVREE */],
  ["REFUSEE" /* REFUSEE */]: [],
  ["LIVREE" /* LIVREE */]: []
};
function transitionAutorisee(depuis, vers) {
  return TRANSITIONS_AUTORISEES[depuis].includes(vers);
}

// src/errors/ErreurMetier.ts
var ErreurMetier = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
  }
};

// src/errors/TransitionStatutInvalideError.ts
var TransitionStatutInvalideError = class extends ErreurMetier {
  constructor(depuis, vers) {
    super(
      "TRANSITION_STATUT_INVALIDE",
      `Impossible de passer du statut "${depuis}" vers "${vers}".`
    );
  }
};

// src/entities/Commande.ts
var Commande = class {
  constructor(id, clientId, restaurantId, articles, prixPlats, fraisLivraison, fraisService, adresseLivraison) {
    this.id = id;
    this.clientId = clientId;
    this.restaurantId = restaurantId;
    this.articles = articles;
    this.prixPlats = prixPlats;
    this.fraisLivraison = fraisLivraison;
    this.fraisService = fraisService;
    this.adresseLivraison = adresseLivraison;
    this.creeLe = /* @__PURE__ */ new Date();
  }
  statut = "EN_ATTENTE" /* EN_ATTENTE */;
  tempsPreparationEstime = null;
  // en minutes
  livreurId = null;
  creeLe;
  changerStatut(nouveauStatut) {
    if (!transitionAutorisee(this.statut, nouveauStatut)) {
      throw new TransitionStatutInvalideError(this.statut, nouveauStatut);
    }
    this.statut = nouveauStatut;
  }
  accepter(tempsPreparation) {
    this.changerStatut("ACCEPTEE" /* ACCEPTEE */);
    this.tempsPreparationEstime = tempsPreparation;
    this.changerStatut("EN_PREPARATION" /* EN_PREPARATION */);
  }
  marquerPrete() {
    this.changerStatut("PRETE" /* PRETE */);
  }
  assignerLivreur(livreurId) {
    this.livreurId = livreurId;
    this.changerStatut("EN_LIVRAISON" /* EN_LIVRAISON */);
  }
  marquerLivree() {
    this.changerStatut("LIVREE" /* LIVREE */);
  }
  prixTotal() {
    return this.prixPlats.ajouter(this.fraisLivraison).ajouter(this.fraisService);
  }
  getStatut() {
    return this.statut;
  }
  getArticles() {
    return this.articles;
  }
  getPrixPlats() {
    return this.prixPlats;
  }
  getFraisLivraison() {
    return this.fraisLivraison;
  }
  getFraisService() {
    return this.fraisService;
  }
  getLivreurId() {
    return this.livreurId;
  }
  getTempsPreparation() {
    return this.tempsPreparationEstime;
  }
  getCreeLe() {
    return this.creeLe;
  }
  getAdresseLivraison() {
    return this.adresseLivraison;
  }
};

// src/entities/PlatMenu.ts
var PlatMenu = class {
  constructor(id, nom, description, prix, allergenes, stockJournalier, restaurantId) {
    this.id = id;
    this.nom = nom;
    this.description = description;
    this.prix = prix;
    this.allergenes = allergenes;
    this.stockJournalier = stockJournalier;
    this.restaurantId = restaurantId;
  }
  estDisponible() {
    return this.stockJournalier > 0;
  }
  diminuerStock(quantite = 1) {
    if (quantite > this.stockJournalier) {
      throw new Error(`Stock insuffisant pour "${this.nom}" (stock: ${this.stockJournalier})`);
    }
    this.stockJournalier -= quantite;
  }
  mettreAJour(infos) {
    if (infos.nom !== void 0) this.nom = infos.nom;
    if (infos.description !== void 0) this.description = infos.description;
    if (infos.prix !== void 0) this.prix = infos.prix;
    if (infos.allergenes !== void 0) this.allergenes = infos.allergenes;
    if (infos.stockJournalier !== void 0) this.stockJournalier = infos.stockJournalier;
  }
};

// src/entities/Restaurant.ts
var Restaurant = class {
  constructor(id, nom, adresse, position, proprietaireId) {
    this.id = id;
    this.nom = nom;
    this.adresse = adresse;
    this.position = position;
    this.proprietaireId = proprietaireId;
  }
};

// src/value-objects/Money.ts
var Money = class _Money {
  centimes;
  constructor(centimes) {
    if (centimes < 0) {
      throw new Error("Un montant ne peut pas \xEAtre n\xE9gatif");
    }
    this.centimes = Math.round(centimes);
  }
  static fromEuros(euros) {
    return new _Money(euros * 100);
  }
  static fromCentimes(centimes) {
    return new _Money(centimes);
  }
  static zero() {
    return new _Money(0);
  }
  ajouter(autre) {
    return new _Money(this.centimes + autre.centimes);
  }
  multiplier(facteur) {
    return new _Money(this.centimes * facteur);
  }
  enEuros() {
    return this.centimes / 100;
  }
  enCentimes() {
    return this.centimes;
  }
  estEgal(autre) {
    return this.centimes === autre.centimes;
  }
  toString() {
    return `${this.enEuros().toFixed(2)} \u20AC`;
  }
};

// src/errors/PanierConflitRestaurantError.ts
var PanierConflitRestaurantError = class extends ErreurMetier {
  constructor(restaurantActuelId, nouvelArticleRestaurantId) {
    super(
      "PANIER_CONFLIT_RESTAURANT",
      `Votre panier contient d\xE9j\xE0 des articles du restaurant ${restaurantActuelId}. Impossible d'ajouter un article du restaurant ${nouvelArticleRestaurantId}.`
    );
    this.restaurantActuelId = restaurantActuelId;
    this.nouvelArticleRestaurantId = nouvelArticleRestaurantId;
  }
  restaurantActuelId;
  nouvelArticleRestaurantId;
};

// src/errors/PlatEnRuptureError.ts
var PlatEnRuptureError = class extends ErreurMetier {
  constructor(platId) {
    super("PLAT_EN_RUPTURE", `Le plat ${platId} n'est plus disponible (stock \xE9puis\xE9).`);
    this.platId = platId;
  }
  platId;
};

// src/entities/Panier.ts
var Panier = class {
  constructor(clientId) {
    this.clientId = clientId;
  }
  articles = [];
  restaurantIdActuel = null;
  ajouterArticle(article) {
    if (this.restaurantIdActuel && this.restaurantIdActuel !== article.restaurantId) {
      throw new PanierConflitRestaurantError(
        this.restaurantIdActuel,
        article.restaurantId
      );
    }
    if (article.quantite <= 0) {
      throw new PlatEnRuptureError(article.menuItemId);
    }
    this.restaurantIdActuel = article.restaurantId;
    const existant = this.articles.find((a) => a.menuItemId === article.menuItemId);
    if (existant) {
      const index = this.articles.indexOf(existant);
      this.articles[index] = existant.avecQuantite(existant.quantite + article.quantite);
    } else {
      this.articles.push(article);
    }
  }
  vider() {
    this.articles = [];
    this.restaurantIdActuel = null;
  }
  getArticles() {
    return this.articles;
  }
  getRestaurantId() {
    return this.restaurantIdActuel;
  }
  estVide() {
    return this.articles.length === 0;
  }
  prixTotal() {
    return this.articles.reduce(
      (total, article) => total.ajouter(article.prixTotal()),
      Money.zero()
    );
  }
};

// src/entities/Client.ts
var Client = class {
  constructor(id, nom, email, adresse) {
    this.id = id;
    this.nom = nom;
    this.email = email;
    this.adresse = adresse;
  }
};

// src/value-objects/StatutLivreur.ts
var StatutLivreur = /* @__PURE__ */ ((StatutLivreur2) => {
  StatutLivreur2["DISPONIBLE"] = "DISPONIBLE";
  StatutLivreur2["INDISPONIBLE"] = "INDISPONIBLE";
  StatutLivreur2["EN_LIVRAISON"] = "EN_LIVRAISON";
  return StatutLivreur2;
})(StatutLivreur || {});

// src/entities/Livreur.ts
var Livreur = class {
  constructor(id, nom, position, telephone) {
    this.id = id;
    this.nom = nom;
    this.position = position;
    this.telephone = telephone;
  }
  statut = "INDISPONIBLE" /* INDISPONIBLE */;
  portefeuille = Money.zero();
  commandeEnCoursId = null;
  seDeclarerDisponible() {
    this.statut = "DISPONIBLE" /* DISPONIBLE */;
  }
  seDeclarerIndisponible() {
    if (this.statut === "EN_LIVRAISON" /* EN_LIVRAISON */) {
      throw new Error("Impossible de se d\xE9clarer indisponible pendant une livraison en cours");
    }
    this.statut = "INDISPONIBLE" /* INDISPONIBLE */;
  }
  prendreEnCharge(commandeId) {
    if (this.statut !== "DISPONIBLE" /* DISPONIBLE */) {
      throw new Error(`Le livreur ${this.nom} n'est pas disponible`);
    }
    this.statut = "EN_LIVRAISON" /* EN_LIVRAISON */;
    this.commandeEnCoursId = commandeId;
  }
  terminerLivraison(gains) {
    this.portefeuille = this.portefeuille.ajouter(gains);
    this.statut = "DISPONIBLE" /* DISPONIBLE */;
    this.commandeEnCoursId = null;
  }
  estDisponible() {
    return this.statut === "DISPONIBLE" /* DISPONIBLE */;
  }
  getStatut() {
    return this.statut;
  }
  getPortefeuille() {
    return this.portefeuille;
  }
  getCommandeEnCoursId() {
    return this.commandeEnCoursId;
  }
};

// src/entities/Facture.ts
var Facture = class {
  constructor(id, commandeId, clientId, articles, prixPlats, fraisLivraison, fraisService, total) {
    this.id = id;
    this.commandeId = commandeId;
    this.clientId = clientId;
    this.articles = articles;
    this.prixPlats = prixPlats;
    this.fraisLivraison = fraisLivraison;
    this.fraisService = fraisService;
    this.total = total;
    this.genereLe = /* @__PURE__ */ new Date();
  }
  genereLe;
  afficher() {
    const lignes = this.articles.map(
      (a) => `  - ${a.nom} x${a.quantite} : ${a.prixTotal().toString()}`
    );
    return [
      `=== FACTURE #${this.id} ===`,
      `Commande : ${this.commandeId}`,
      `Date : ${this.genereLe.toLocaleString()}`,
      ``,
      `Articles :`,
      ...lignes,
      ``,
      `Sous-total (plats) : ${this.prixPlats.toString()}`,
      `Frais de livraison : ${this.fraisLivraison.toString()}`,
      `Frais de service   : ${this.fraisService.toString()}`,
      ``,
      `TOTAL : ${this.total.toString()}`
    ].join("\n");
  }
};

// src/value-objects/Coordonnees.ts
var Coordonnees = class {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
    if (latitude < -90 || latitude > 90) {
      throw new Error(`Latitude invalide : ${latitude}`);
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error(`Longitude invalide : ${longitude}`);
    }
  }
  estEgal(autre) {
    return this.latitude === autre.latitude && this.longitude === autre.longitude;
  }
  toString() {
    return `(${this.latitude}, ${this.longitude})`;
  }
};

// src/value-objects/ArticlePanier.ts
var ArticlePanier = class _ArticlePanier {
  constructor(menuItemId, nom, prixSnapshot, quantite, restaurantId) {
    this.menuItemId = menuItemId;
    this.nom = nom;
    this.prixSnapshot = prixSnapshot;
    this.quantite = quantite;
    this.restaurantId = restaurantId;
    if (quantite <= 0) {
      throw new Error("La quantit\xE9 doit \xEAtre sup\xE9rieure \xE0 0");
    }
  }
  prixTotal() {
    return this.prixSnapshot.multiplier(this.quantite);
  }
  avecQuantite(nouvelleQuantite) {
    return new _ArticlePanier(
      this.menuItemId,
      this.nom,
      this.prixSnapshot,
      nouvelleQuantite,
      this.restaurantId
    );
  }
};

// src/errors/CommandeIntrouvableError.ts
var CommandeIntrouvableError = class extends ErreurMetier {
  constructor(commandeId) {
    super("COMMANDE_INTROUVABLE", `Aucune commande trouv\xE9e avec l'identifiant : ${commandeId}`);
    this.commandeId = commandeId;
  }
  commandeId;
};

// src/errors/AucunLivreurDisponibleError.ts
var AucunLivreurDisponibleError = class extends ErreurMetier {
  constructor(restaurantId) {
    super(
      "AUCUN_LIVREUR_DISPONIBLE",
      `Aucun livreur disponible \xE0 proximit\xE9 du restaurant ${restaurantId}.`
    );
    this.restaurantId = restaurantId;
  }
  restaurantId;
};

// src/errors/RestaurantIntrouvableError.ts
var RestaurantIntrouvableError = class extends ErreurMetier {
  constructor(restaurantId) {
    super("RESTAURANT_INTROUVABLE", `Restaurant introuvable : ${restaurantId}`);
    this.restaurantId = restaurantId;
  }
  restaurantId;
};

// src/errors/ClientIntrouvableError.ts
var ClientIntrouvableError = class extends ErreurMetier {
  constructor(clientId) {
    super("CLIENT_INTROUVABLE", `Client introuvable : ${clientId}`);
    this.clientId = clientId;
  }
  clientId;
};

// src/errors/PlatIntrouvableError.ts
var PlatIntrouvableError = class extends ErreurMetier {
  constructor(platId) {
    super("PLAT_INTROUVABLE", `Plat introuvable : ${platId}`);
    this.platId = platId;
  }
  platId;
};

// src/services/CalculDistanceService.ts
var CalculDistanceService = class _CalculDistanceService {
  static RAYON_TERRE_KM = 6371;
  calculerKm(pointA, pointB) {
    const latARad = this.versRadians(pointA.latitude);
    const latBRad = this.versRadians(pointB.latitude);
    const deltaLat = this.versRadians(pointB.latitude - pointA.latitude);
    const deltaLon = this.versRadians(pointB.longitude - pointA.longitude);
    const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(latARad) * Math.cos(latBRad) * Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return _CalculDistanceService.RAYON_TERRE_KM * c;
  }
  versRadians(degres) {
    return degres * Math.PI / 180;
  }
};

// src/services/CalculPrixService.ts
var CalculPrixService = class _CalculPrixService {
  static TARIF_KM = 0.5;
  // euros par km
  static TAUX_FRAIS_SERVICE = 0.1;
  // 10%
  calculerFraisLivraison(distanceKm) {
    return Money.fromEuros(distanceKm * _CalculPrixService.TARIF_KM);
  }
  calculerFraisService(prixPlats) {
    return Money.fromEuros(prixPlats.enEuros() * _CalculPrixService.TAUX_FRAIS_SERVICE);
  }
  calculerSousTotalPlats(articles) {
    return articles.reduce(
      (total, article) => total.ajouter(article.prixTotal()),
      Money.zero()
    );
  }
  calculerTotal(articles, distanceKm) {
    const prixPlats = this.calculerSousTotalPlats(articles);
    const fraisLivraison = this.calculerFraisLivraison(distanceKm);
    const fraisService = this.calculerFraisService(prixPlats);
    const total = prixPlats.ajouter(fraisLivraison).ajouter(fraisService);
    return { prixPlats, fraisLivraison, fraisService, total };
  }
};

// src/services/SelectionLivreurService.ts
var SelectionLivreurService = class {
  calculDistance = new CalculDistanceService();
  trouverLePlusProche(livreurs, positionRestaurant, restaurantId) {
    const dispos = livreurs.filter((l) => l.estDisponible());
    if (dispos.length === 0) {
      throw new AucunLivreurDisponibleError(restaurantId);
    }
    return dispos.reduce((lePlusProche, livreur) => {
      const distActuel = this.calculDistance.calculerKm(livreur.position, positionRestaurant);
      const distPlusProche = this.calculDistance.calculerKm(lePlusProche.position, positionRestaurant);
      return distActuel < distPlusProche ? livreur : lePlusProche;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ArticlePanier,
  AucunLivreurDisponibleError,
  CalculDistanceService,
  CalculPrixService,
  Client,
  ClientIntrouvableError,
  Commande,
  CommandeIntrouvableError,
  Coordonnees,
  ErreurMetier,
  Facture,
  Livreur,
  Money,
  Panier,
  PanierConflitRestaurantError,
  PlatEnRuptureError,
  PlatIntrouvableError,
  PlatMenu,
  Restaurant,
  RestaurantIntrouvableError,
  SelectionLivreurService,
  StatutCommande,
  StatutLivreur,
  TransitionStatutInvalideError,
  transitionAutorisee
});
