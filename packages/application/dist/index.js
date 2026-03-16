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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AccepterCommandeUseCase: () => AccepterCommandeUseCase,
  AjouterAuPanierUseCase: () => AjouterAuPanierUseCase,
  AjouterPlatUseCase: () => AjouterPlatUseCase,
  AttribuerLivraisonUseCase: () => AttribuerLivraisonUseCase,
  ChangerStatutLivreurUseCase: () => ChangerStatutLivreurUseCase,
  ListerRestaurantsUseCase: () => ListerRestaurantsUseCase,
  MarquerCommandePreteUseCase: () => MarquerCommandePreteUseCase,
  ModifierPlatUseCase: () => ModifierPlatUseCase,
  PasserCommandeUseCase: () => PasserCommandeUseCase,
  PayerCommandeUseCase: () => PayerCommandeUseCase,
  RefuserCommandeUseCase: () => RefuserCommandeUseCase,
  SupprimerPlatUseCase: () => SupprimerPlatUseCase,
  TerminerLivraisonUseCase: () => TerminerLivraisonUseCase,
  VoirMenuRestaurantUseCase: () => VoirMenuRestaurantUseCase
});
module.exports = __toCommonJS(index_exports);

// src/use-cases/client/ListerRestaurantsUseCase.ts
var ListerRestaurantsUseCase = class {
  constructor(depotRestaurants) {
    this.depotRestaurants = depotRestaurants;
  }
  async executer() {
    return this.depotRestaurants.listerTous();
  }
};

// src/use-cases/client/VoirMenuRestaurantUseCase.ts
var VoirMenuRestaurantUseCase = class {
  constructor(depotPlats) {
    this.depotPlats = depotPlats;
  }
  async executer(restaurantId) {
    const plats = await this.depotPlats.trouverParRestaurant(restaurantId);
    return {
      disponibles: plats.filter((p) => p.estDisponible()),
      rupture: plats.filter((p) => !p.estDisponible())
    };
  }
};

// src/use-cases/client/AjouterAuPanierUseCase.ts
var import_domain = require("@ecoeats/domain");
var import_domain2 = require("@ecoeats/domain");
var AjouterAuPanierUseCase = class {
  constructor(depotPlats, depotClients) {
    this.depotPlats = depotPlats;
    this.depotClients = depotClients;
  }
  paniers = /* @__PURE__ */ new Map();
  async executer(req) {
    await this.depotClients.trouverParId(req.clientId);
    const plat = await this.depotPlats.trouverParId(req.platId);
    if (!plat.estDisponible()) {
      throw new import_domain2.PlatEnRuptureError(plat.id);
    }
    const panier = this.obtenirOuCreerPanier(req.clientId);
    const article = new import_domain.ArticlePanier(
      plat.id,
      plat.nom,
      plat.prix,
      req.quantite,
      plat.restaurantId
    );
    panier.ajouterArticle(article);
    return panier;
  }
  viderPanier(clientId) {
    const panier = this.paniers.get(clientId);
    if (panier) panier.vider();
  }
  getPanier(clientId) {
    return this.paniers.get(clientId) ?? null;
  }
  obtenirOuCreerPanier(clientId) {
    if (!this.paniers.has(clientId)) {
      this.paniers.set(clientId, new import_domain.Panier(clientId));
    }
    return this.paniers.get(clientId);
  }
};

// src/use-cases/client/PasserCommandeUseCase.ts
var import_domain3 = require("@ecoeats/domain");
var import_domain4 = require("@ecoeats/domain");

// ../../node_modules/uuid/dist/esm-node/rng.js
var import_crypto = __toESM(require("crypto"));
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    import_crypto.default.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// ../../node_modules/uuid/dist/esm-node/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

// ../../node_modules/uuid/dist/esm-node/native.js
var import_crypto2 = __toESM(require("crypto"));
var native_default = {
  randomUUID: import_crypto2.default.randomUUID
};

// ../../node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/use-cases/client/PasserCommandeUseCase.ts
var PasserCommandeUseCase = class {
  constructor(depotCommandes, depotRestaurants, depotClients, depotPlats, cartographie) {
    this.depotCommandes = depotCommandes;
    this.depotRestaurants = depotRestaurants;
    this.depotClients = depotClients;
    this.depotPlats = depotPlats;
    this.cartographie = cartographie;
  }
  calculPrix = new import_domain4.CalculPrixService();
  async executer(req) {
    if (req.panier.estVide()) {
      throw new Error("Impossible de passer une commande avec un panier vide.");
    }
    const client = await this.depotClients.trouverParId(req.clientId);
    const restaurantId = req.panier.getRestaurantId();
    const restaurant = await this.depotRestaurants.trouverParId(restaurantId);
    const positionClient = { latitude: 48.8566, longitude: 2.3522 };
    const distanceKm = this.cartographie.calculerDistanceKm(
      restaurant.position,
      positionClient
    );
    for (const article of req.panier.getArticles()) {
      const plat = await this.depotPlats.trouverParId(article.menuItemId);
      plat.diminuerStock(article.quantite);
      await this.depotPlats.sauvegarder(plat);
    }
    const { prixPlats, fraisLivraison, fraisService } = this.calculPrix.calculerTotal(
      req.panier.getArticles(),
      distanceKm
    );
    const commande = new import_domain3.Commande(
      v4_default(),
      req.clientId,
      restaurantId,
      [...req.panier.getArticles()],
      prixPlats,
      fraisLivraison,
      fraisService,
      req.adresseLivraison
    );
    await this.depotCommandes.sauvegarder(commande);
    req.panier.vider();
    return commande;
  }
};

// src/use-cases/client/PayerCommandeUseCase.ts
var import_domain5 = require("@ecoeats/domain");
var PayerCommandeUseCase = class {
  constructor(depotCommandes, depotFactures, servicePaiement) {
    this.depotCommandes = depotCommandes;
    this.depotFactures = depotFactures;
    this.servicePaiement = servicePaiement;
  }
  async executer(req) {
    const commande = await this.depotCommandes.trouverParId(req.commandeId);
    const paiement = await this.servicePaiement.encaisser(
      commande.prixTotal().enCentimes(),
      req.clientId
    );
    if (!paiement.success) {
      throw new Error(`Paiement refus\xE9 pour la commande ${req.commandeId}`);
    }
    commande.changerStatut(import_domain5.StatutCommande.PAYEE);
    const facture = new import_domain5.Facture(
      v4_default(),
      commande.id,
      req.clientId,
      commande.getArticles(),
      commande.getPrixPlats(),
      commande.getFraisLivraison(),
      commande.getFraisService(),
      commande.prixTotal()
    );
    await this.depotCommandes.sauvegarder(commande);
    await this.depotFactures.sauvegarder(facture);
    return { commande, facture };
  }
};

// src/use-cases/restaurant/AjouterPlatUseCase.ts
var import_domain6 = require("@ecoeats/domain");
var AjouterPlatUseCase = class {
  constructor(depotPlats, depotRestaurants) {
    this.depotPlats = depotPlats;
    this.depotRestaurants = depotRestaurants;
  }
  async executer(req) {
    await this.depotRestaurants.trouverParId(req.restaurantId);
    const plat = new import_domain6.PlatMenu(
      v4_default(),
      req.nom,
      req.description,
      import_domain6.Money.fromEuros(req.prixEuros),
      req.allergenes,
      req.stockJournalier,
      req.restaurantId
    );
    await this.depotPlats.sauvegarder(plat);
    return plat;
  }
};

// src/use-cases/restaurant/ModifierPlatUseCase.ts
var import_domain7 = require("@ecoeats/domain");
var ModifierPlatUseCase = class {
  constructor(depotPlats) {
    this.depotPlats = depotPlats;
  }
  async executer(req) {
    const plat = await this.depotPlats.trouverParId(req.platId);
    plat.mettreAJour({
      nom: req.nom,
      description: req.description,
      prix: req.prixEuros !== void 0 ? import_domain7.Money.fromEuros(req.prixEuros) : void 0,
      allergenes: req.allergenes,
      stockJournalier: req.stockJournalier
    });
    await this.depotPlats.sauvegarder(plat);
  }
};

// src/use-cases/restaurant/SupprimerPlatUseCase.ts
var SupprimerPlatUseCase = class {
  constructor(depotPlats) {
    this.depotPlats = depotPlats;
  }
  async executer(platId) {
    await this.depotPlats.trouverParId(platId);
    await this.depotPlats.supprimer(platId);
  }
};

// src/use-cases/restaurant/AccepterCommandeUseCase.ts
var AccepterCommandeUseCase = class {
  constructor(depotCommandes) {
    this.depotCommandes = depotCommandes;
  }
  async executer(req) {
    const commande = await this.depotCommandes.trouverParId(req.commandeId);
    commande.accepter(req.tempsPreparationMinutes);
    await this.depotCommandes.sauvegarder(commande);
    return commande;
  }
};

// src/use-cases/restaurant/RefuserCommandeUseCase.ts
var import_domain8 = require("@ecoeats/domain");
var RefuserCommandeUseCase = class {
  constructor(depotCommandes) {
    this.depotCommandes = depotCommandes;
  }
  async executer(commandeId) {
    const commande = await this.depotCommandes.trouverParId(commandeId);
    commande.changerStatut(import_domain8.StatutCommande.REFUSEE);
    await this.depotCommandes.sauvegarder(commande);
    return commande;
  }
};

// src/use-cases/restaurant/MarquerCommandePreteUseCase.ts
var MarquerCommandePreteUseCase = class {
  constructor(depotCommandes) {
    this.depotCommandes = depotCommandes;
  }
  async executer(commandeId) {
    const commande = await this.depotCommandes.trouverParId(commandeId);
    commande.marquerPrete();
    await this.depotCommandes.sauvegarder(commande);
    return commande;
  }
};

// src/use-cases/livreur/ChangerStatutLivreurUseCase.ts
var ChangerStatutLivreurUseCase = class {
  constructor(depotLivreurs) {
    this.depotLivreurs = depotLivreurs;
  }
  async executer(req) {
    const livreur = await this.depotLivreurs.trouverParId(req.livreurId);
    if (req.statut === "DISPONIBLE") {
      livreur.seDeclarerDisponible();
    } else {
      livreur.seDeclarerIndisponible();
    }
    await this.depotLivreurs.sauvegarder(livreur);
    return livreur;
  }
};

// src/use-cases/livreur/AttribuerLivraisonUseCase.ts
var import_domain9 = require("@ecoeats/domain");
var import_domain10 = require("@ecoeats/domain");
var AttribuerLivraisonUseCase = class {
  constructor(depotCommandes, depotLivreurs, depotRestaurants) {
    this.depotCommandes = depotCommandes;
    this.depotLivreurs = depotLivreurs;
    this.depotRestaurants = depotRestaurants;
  }
  selectionLivreur = new import_domain10.SelectionLivreurService();
  async executer(req) {
    const commande = await this.depotCommandes.trouverParId(req.commandeId);
    if (commande.getStatut() !== import_domain9.StatutCommande.PRETE) {
      throw new Error(`La commande ${req.commandeId} n'est pas encore pr\xEAte pour la collecte.`);
    }
    const restaurant = await this.depotRestaurants.trouverParId(commande.restaurantId);
    const livreurs = await this.depotLivreurs.listerDisponibles();
    const livreurChoisi = this.selectionLivreur.trouverLePlusProche(
      livreurs,
      restaurant.position,
      restaurant.id
    );
    livreurChoisi.prendreEnCharge(commande.id);
    commande.assignerLivreur(livreurChoisi.id);
    await this.depotLivreurs.sauvegarder(livreurChoisi);
    await this.depotCommandes.sauvegarder(commande);
    return { commande, livreur: livreurChoisi };
  }
};

// src/use-cases/livreur/TerminerLivraisonUseCase.ts
var import_domain11 = require("@ecoeats/domain");
var PRISE_EN_CHARGE_EUROS = 2;
var TARIF_KM_LIVREUR = 1;
var TerminerLivraisonUseCase = class {
  constructor(depotCommandes, depotLivreurs, depotRestaurants, cartographie) {
    this.depotCommandes = depotCommandes;
    this.depotLivreurs = depotLivreurs;
    this.depotRestaurants = depotRestaurants;
    this.cartographie = cartographie;
  }
  async executer(req) {
    const commande = await this.depotCommandes.trouverParId(req.commandeId);
    const livreur = await this.depotLivreurs.trouverParId(req.livreurId);
    const restaurant = await this.depotRestaurants.trouverParId(commande.restaurantId);
    const positionClient = { latitude: 48.8566, longitude: 2.3522 };
    const distanceKm = this.cartographie.calculerDistanceKm(
      restaurant.position,
      positionClient
    );
    const gains = import_domain11.Money.fromEuros(
      PRISE_EN_CHARGE_EUROS + distanceKm * TARIF_KM_LIVREUR + (req.pourboire ?? 0)
    );
    commande.marquerLivree();
    livreur.terminerLivraison(gains);
    await this.depotCommandes.sauvegarder(commande);
    await this.depotLivreurs.sauvegarder(livreur);
    return { livreur, gains };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AccepterCommandeUseCase,
  AjouterAuPanierUseCase,
  AjouterPlatUseCase,
  AttribuerLivraisonUseCase,
  ChangerStatutLivreurUseCase,
  ListerRestaurantsUseCase,
  MarquerCommandePreteUseCase,
  ModifierPlatUseCase,
  PasserCommandeUseCase,
  PayerCommandeUseCase,
  RefuserCommandeUseCase,
  SupprimerPlatUseCase,
  TerminerLivraisonUseCase,
  VoirMenuRestaurantUseCase
});
