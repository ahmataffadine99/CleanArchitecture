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
  CartographieHaversine: () => CartographieHaversine,
  DepotClientsEnMemoire: () => DepotClientsEnMemoire,
  DepotCommandesEnMemoire: () => DepotCommandesEnMemoire,
  DepotCommandesPrisma: () => DepotCommandesPrisma,
  DepotFacturesEnMemoire: () => DepotFacturesEnMemoire,
  DepotLivreursEnMemoire: () => DepotLivreursEnMemoire,
  DepotLivreursPrisma: () => DepotLivreursPrisma,
  DepotPlatsEnMemoire: () => DepotPlatsEnMemoire,
  DepotPlatsPrisma: () => DepotPlatsPrisma,
  DepotRestaurantsEnMemoire: () => DepotRestaurantsEnMemoire,
  DepotRestaurantsPrisma: () => DepotRestaurantsPrisma,
  PaiementSimule: () => PaiementSimule
});
module.exports = __toCommonJS(index_exports);

// src/in-memory/DepotCommandesEnMemoire.ts
var import_domain = require("@ecoeats/domain");
var DepotCommandesEnMemoire = class {
  store = /* @__PURE__ */ new Map();
  async sauvegarder(commande) {
    this.store.set(commande.id, commande);
  }
  async trouverParId(id) {
    const commande = this.store.get(id);
    if (!commande) throw new import_domain.CommandeIntrouvableError(id);
    return commande;
  }
  async trouverParRestaurant(restaurantId) {
    return [...this.store.values()].filter((c) => c.restaurantId === restaurantId);
  }
  async trouverParClient(clientId) {
    return [...this.store.values()].filter((c) => c.clientId === clientId);
  }
};

// src/in-memory/DepotRestaurantsEnMemoire.ts
var import_domain2 = require("@ecoeats/domain");
var DepotRestaurantsEnMemoire = class {
  store = /* @__PURE__ */ new Map();
  async sauvegarder(restaurant) {
    this.store.set(restaurant.id, restaurant);
  }
  async trouverParId(id) {
    const resto = this.store.get(id);
    if (!resto) throw new import_domain2.RestaurantIntrouvableError(id);
    return resto;
  }
  async listerTous() {
    return [...this.store.values()];
  }
};

// src/in-memory/DepotPlatsEnMemoire.ts
var import_domain3 = require("@ecoeats/domain");
var DepotPlatsEnMemoire = class {
  store = /* @__PURE__ */ new Map();
  async sauvegarder(plat) {
    this.store.set(plat.id, plat);
  }
  async trouverParId(id) {
    const plat = this.store.get(id);
    if (!plat) throw new import_domain3.PlatIntrouvableError(id);
    return plat;
  }
  async trouverParRestaurant(restaurantId) {
    return [...this.store.values()].filter((p) => p.restaurantId === restaurantId);
  }
  async supprimer(id) {
    this.store.delete(id);
  }
};

// src/in-memory/DepotClientsEnMemoire.ts
var import_domain4 = require("@ecoeats/domain");
var DepotClientsEnMemoire = class {
  store = /* @__PURE__ */ new Map();
  async sauvegarder(client) {
    this.store.set(client.id, client);
  }
  async trouverParId(id) {
    const client = this.store.get(id);
    if (!client) throw new import_domain4.ClientIntrouvableError(id);
    return client;
  }
};

// src/in-memory/DepotLivreursEnMemoire.ts
var DepotLivreursEnMemoire = class {
  store = /* @__PURE__ */ new Map();
  async sauvegarder(livreur) {
    this.store.set(livreur.id, livreur);
  }
  async trouverParId(id) {
    const livreur = this.store.get(id);
    if (!livreur) throw new Error(`Livreur introuvable : ${id}`);
    return livreur;
  }
  async listerDisponibles() {
    return [...this.store.values()].filter((l) => l.estDisponible());
  }
};

// src/in-memory/DepotFacturesEnMemoire.ts
var DepotFacturesEnMemoire = class {
  store = /* @__PURE__ */ new Map();
  async sauvegarder(facture) {
    this.store.set(facture.commandeId, facture);
  }
  async trouverParCommande(commandeId) {
    return this.store.get(commandeId) ?? null;
  }
};

// src/postgresql/DepotCommandesPrisma.ts
var import_domain5 = require("@ecoeats/domain");
var import_domain6 = require("@ecoeats/domain");
var DepotCommandesPrisma = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async sauvegarder(commande) {
    await this.prisma.commande.upsert({
      where: { id: commande.id },
      update: {
        statut: commande.getStatut(),
        livreurId: commande.getLivreurId(),
        tempsPreparation: commande.getTempsPreparation()
      },
      create: {
        id: commande.id,
        clientId: commande.clientId,
        restaurantId: commande.restaurantId,
        statut: commande.getStatut(),
        prixPlatsCentimes: commande.getPrixPlats().enCentimes(),
        fraisLivCentimes: commande.getFraisLivraison().enCentimes(),
        fraisServiceCentimes: commande.getFraisService().enCentimes(),
        adresseLivraison: commande.getAdresseLivraison(),
        articles: {
          create: commande.getArticles().map((a) => ({
            menuItemId: a.menuItemId,
            nom: a.nom,
            prixCentimes: a.prixSnapshot.enCentimes(),
            quantite: a.quantite,
            restaurantId: a.restaurantId
          }))
        }
      }
    });
  }
  async trouverParId(id) {
    const row = await this.prisma.commande.findUnique({
      where: { id },
      include: { articles: true }
    });
    if (!row) throw new import_domain6.CommandeIntrouvableError(id);
    return this.reconstruire(row);
  }
  async trouverParRestaurant(restaurantId) {
    const rows = await this.prisma.commande.findMany({
      where: { restaurantId },
      include: { articles: true }
    });
    return rows.map((r) => this.reconstruire(r));
  }
  async trouverParClient(clientId) {
    const rows = await this.prisma.commande.findMany({
      where: { clientId },
      include: { articles: true }
    });
    return rows.map((r) => this.reconstruire(r));
  }
  reconstruire(row) {
    const articles = row.articles.map(
      (a) => new import_domain5.ArticlePanier(
        a.menuItemId,
        a.nom,
        import_domain5.Money.fromCentimes(a.prixCentimes),
        a.quantite,
        a.restaurantId
      )
    );
    return new import_domain5.Commande(
      row.id,
      row.clientId,
      row.restaurantId,
      articles,
      import_domain5.Money.fromCentimes(row.prixPlatsCentimes),
      import_domain5.Money.fromCentimes(row.fraisLivCentimes),
      import_domain5.Money.fromCentimes(row.fraisServiceCentimes),
      row.adresseLivraison
    );
  }
};

// src/postgresql/DepotRestaurantsPrisma.ts
var import_domain7 = require("@ecoeats/domain");
var import_domain8 = require("@ecoeats/domain");
var DepotRestaurantsPrisma = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async sauvegarder(restaurant) {
    await this.prisma.restaurant.upsert({
      where: { id: restaurant.id },
      update: {
        nom: restaurant.nom,
        adresse: restaurant.adresse,
        latitude: restaurant.position.latitude,
        longitude: restaurant.position.longitude
      },
      create: {
        id: restaurant.id,
        nom: restaurant.nom,
        adresse: restaurant.adresse,
        latitude: restaurant.position.latitude,
        longitude: restaurant.position.longitude,
        proprietaireId: restaurant.proprietaireId
      }
    });
  }
  async trouverParId(id) {
    const row = await this.prisma.restaurant.findUnique({ where: { id } });
    if (!row) throw new import_domain8.RestaurantIntrouvableError(id);
    return new import_domain7.Restaurant(
      row.id,
      row.nom,
      row.adresse,
      new import_domain7.Coordonnees(row.latitude, row.longitude),
      row.proprietaireId
    );
  }
  async listerTous() {
    const rows = await this.prisma.restaurant.findMany();
    return rows.map(
      (r) => new import_domain7.Restaurant(r.id, r.nom, r.adresse, new import_domain7.Coordonnees(r.latitude, r.longitude), r.proprietaireId)
    );
  }
};

// src/postgresql/DepotPlatsPrisma.ts
var import_domain9 = require("@ecoeats/domain");
var import_domain10 = require("@ecoeats/domain");
var DepotPlatsPrisma = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async sauvegarder(plat) {
    await this.prisma.platMenu.upsert({
      where: { id: plat.id },
      update: {
        nom: plat.nom,
        description: plat.description,
        prixCentimes: plat.prix.enCentimes(),
        allergenes: plat.allergenes,
        stockJournalier: plat.stockJournalier
      },
      create: {
        id: plat.id,
        nom: plat.nom,
        description: plat.description,
        prixCentimes: plat.prix.enCentimes(),
        allergenes: plat.allergenes,
        stockJournalier: plat.stockJournalier,
        restaurantId: plat.restaurantId
      }
    });
  }
  async trouverParId(id) {
    const row = await this.prisma.platMenu.findUnique({ where: { id } });
    if (!row) throw new import_domain10.PlatIntrouvableError(id);
    return new import_domain9.PlatMenu(row.id, row.nom, row.description, import_domain9.Money.fromCentimes(row.prixCentimes), row.allergenes, row.stockJournalier, row.restaurantId);
  }
  async trouverParRestaurant(restaurantId) {
    const rows = await this.prisma.platMenu.findMany({ where: { restaurantId } });
    return rows.map((r) => new import_domain9.PlatMenu(r.id, r.nom, r.description, import_domain9.Money.fromCentimes(r.prixCentimes), r.allergenes, r.stockJournalier, r.restaurantId));
  }
  async supprimer(id) {
    await this.prisma.platMenu.delete({ where: { id } });
  }
};

// src/postgresql/DepotLivreursPrisma.ts
var import_domain11 = require("@ecoeats/domain");
var DepotLivreursPrisma = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async sauvegarder(livreur) {
    await this.prisma.livreur.upsert({
      where: { id: livreur.id },
      update: {
        statut: livreur.getStatut(),
        portefeuilleCentimes: livreur.getPortefeuille().enCentimes(),
        latitude: livreur.position.latitude,
        longitude: livreur.position.longitude
      },
      create: {
        id: livreur.id,
        nom: livreur.nom,
        telephone: livreur.telephone,
        latitude: livreur.position.latitude,
        longitude: livreur.position.longitude,
        statut: livreur.getStatut(),
        portefeuilleCentimes: 0
      }
    });
  }
  async trouverParId(id) {
    const row = await this.prisma.livreur.findUnique({ where: { id } });
    if (!row) throw new Error(`Livreur introuvable : ${id}`);
    return this.reconstruire(row);
  }
  async listerDisponibles() {
    const rows = await this.prisma.livreur.findMany({ where: { statut: "DISPONIBLE" } });
    return rows.map((r) => this.reconstruire(r));
  }
  reconstruire(row) {
    const livreur = new import_domain11.Livreur(
      row.id,
      row.nom,
      new import_domain11.Coordonnees(row.latitude, row.longitude),
      row.telephone
    );
    if (row.statut === import_domain11.StatutLivreur.DISPONIBLE) livreur.seDeclarerDisponible();
    return livreur;
  }
};

// src/services/CartographieHaversine.ts
var import_domain12 = require("@ecoeats/domain");
var CartographieHaversine = class {
  calculateur = new import_domain12.CalculDistanceService();
  calculerDistanceKm(pointA, pointB) {
    return this.calculateur.calculerKm(pointA, pointB);
  }
};

// src/services/PaiementSimule.ts
var import_uuid = require("uuid");
var PaiementSimule = class {
  async encaisser(montantCentimes, clientId) {
    console.log(`[Paiement] ${montantCentimes / 100}\u20AC pr\xE9lev\xE9 pour le client ${clientId}`);
    await new Promise((res) => setTimeout(res, 10));
    return { success: true, transactionId: `TXN-${(0, import_uuid.v4)().slice(0, 8).toUpperCase()}` };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CartographieHaversine,
  DepotClientsEnMemoire,
  DepotCommandesEnMemoire,
  DepotCommandesPrisma,
  DepotFacturesEnMemoire,
  DepotLivreursEnMemoire,
  DepotLivreursPrisma,
  DepotPlatsEnMemoire,
  DepotPlatsPrisma,
  DepotRestaurantsEnMemoire,
  DepotRestaurantsPrisma,
  PaiementSimule
});
