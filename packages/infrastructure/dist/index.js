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
  CartographieHaversine: () => CartographieHaversine,
  DepotAvisPrisma: () => DepotAvisPrisma,
  DepotClientsEnMemoire: () => DepotClientsEnMemoire,
  DepotClientsPrisma: () => DepotClientsPrisma,
  DepotCommandesEnMemoire: () => DepotCommandesEnMemoire,
  DepotCommandesPrisma: () => DepotCommandesPrisma,
  DepotComptesEnMemoire: () => DepotComptesEnMemoire,
  DepotComptesPrisma: () => DepotComptesPrisma,
  DepotFacturesEnMemoire: () => DepotFacturesEnMemoire,
  DepotFavorisPrisma: () => DepotFavorisPrisma,
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
  async trouverParLivreur(livreurId) {
    return [...this.store.values()].filter((c) => c.getLivreurId() === livreurId).sort((a, b) => b.getCreeLe().getTime() - a.getCreeLe().getTime());
  }
  async trouverTout() {
    return [...this.store.values()];
  }
  async trouverCommandesSansLivreur() {
    return [...this.store.values()].filter(
      (c) => ["EN_PREPARATION", "PRETE"].includes(c.getStatut()) && !c.getLivreurId()
    );
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
  async trouverParProprietaireId(proprietaireId) {
    return [...this.store.values()].find((r) => r.proprietaireId === proprietaireId) || null;
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
    return [...this.store.values()].filter((l) => l.getStatut() === "DISPONIBLE");
  }
  async listerEligiblesPourRestaurant(restaurantId) {
    return this.listerDisponibles();
  }
  async retirerPropositionDeTous(commandeId) {
    for (const livreur of this.store.values()) {
      livreur.refuserProposition(commandeId);
    }
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

// src/in-memory/DepotComptesEnMemoire.ts
var DepotComptesEnMemoire = class {
  store = /* @__PURE__ */ new Map();
  async sauvegarder(compte) {
    this.store.set(compte.email, compte);
  }
  async trouverParEmail(email) {
    return this.store.get(email) ?? null;
  }
  async trouverParId(id) {
    for (const compte of this.store.values()) {
      if (compte.id === id) return compte;
    }
    return null;
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
    const existe = await this.prisma.commande.findUnique({
      where: { id: commande.id }
    });
    if (existe) {
      await this.prisma.commande.update({
        where: { id: commande.id },
        data: {
          statut: commande.getStatut(),
          livreurId: commande.getLivreurId(),
          tempsPreparation: commande.getTempsPreparation(),
          latitudeLivraison: commande.getPositionLivraison().latitude,
          longitudeLivraison: commande.getPositionLivraison().longitude
        }
      });
    } else {
      await this.prisma.commande.create({
        data: {
          id: commande.id,
          clientId: commande.clientId,
          restaurantId: commande.restaurantId,
          statut: commande.getStatut(),
          prixPlatsCentimes: commande.getPrixPlats().enCentimes(),
          fraisLivCentimes: commande.getFraisLivraison().enCentimes(),
          fraisServiceCentimes: commande.getFraisService().enCentimes(),
          reductionCentimes: commande.getReduction().enCentimes(),
          adresseLivraison: commande.getAdresseLivraison(),
          latitudeLivraison: commande.getPositionLivraison().latitude,
          longitudeLivraison: commande.getPositionLivraison().longitude,
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
  async trouverParLivreur(livreurId) {
    const rows = await this.prisma.commande.findMany({
      where: { livreurId },
      include: { articles: true },
      orderBy: { creeLe: "desc" }
    });
    return rows.map((r) => this.reconstruire(r));
  }
  async trouverTout() {
    const rows = await this.prisma.commande.findMany({
      include: { articles: true }
    });
    return rows.map((r) => this.reconstruire(r));
  }
  async trouverCommandesSansLivreur() {
    const rows = await this.prisma.commande.findMany({
      where: {
        statut: { in: [import_domain5.StatutCommande.EN_PREPARATION, import_domain5.StatutCommande.PRETE] },
        livreurId: null
      },
      include: { articles: true }
    });
    return rows.map((r) => this.reconstruire(r));
  }
  reconstruire(row) {
    const articles = (row.articles ?? []).map(
      (a) => new import_domain5.ArticlePanier(
        a.menuItemId,
        a.nom,
        import_domain5.Money.fromCentimes(a.prixCentimes),
        a.quantite,
        a.restaurantId
      )
    );
    const commande = new import_domain5.Commande(
      row.id,
      row.clientId,
      row.restaurantId,
      articles,
      import_domain5.Money.fromCentimes(row.prixPlatsCentimes),
      import_domain5.Money.fromCentimes(row.fraisLivCentimes),
      import_domain5.Money.fromCentimes(row.fraisServiceCentimes),
      row.adresseLivraison,
      new import_domain5.Coordonnees(row.latitudeLivraison || 48.8566, row.longitudeLivraison || 2.3522),
      import_domain5.Money.fromCentimes(row.reductionCentimes ?? 0),
      row.creeLe
    );
    const transitions = this.retrouverTransitions(row.statut);
    for (const t of transitions) {
      try {
        commande.changerStatut(t);
      } catch (_) {
      }
    }
    if (row.tempsPreparation !== null && row.tempsPreparation !== void 0) {
      commande.restaurerTempsPreparation(row.tempsPreparation);
    }
    if (row.livreurId) {
      commande.assignerLivreur(row.livreurId);
    }
    return commande;
  }
  /**
   * Retrouve la suite minimale de transitions pour passer de EN_ATTENTE au statut cible.
   * Respecte strictement la machine à états du Domain.
   */
  retrouverTransitions(statut) {
    const chemin = {
      [import_domain5.StatutCommande.EN_ATTENTE]: [],
      [import_domain5.StatutCommande.PAYEE]: [import_domain5.StatutCommande.PAYEE],
      [import_domain5.StatutCommande.ACCEPTEE]: [import_domain5.StatutCommande.PAYEE, import_domain5.StatutCommande.ACCEPTEE],
      [import_domain5.StatutCommande.EN_PREPARATION]: [import_domain5.StatutCommande.PAYEE, import_domain5.StatutCommande.ACCEPTEE, import_domain5.StatutCommande.EN_PREPARATION],
      [import_domain5.StatutCommande.PRETE]: [import_domain5.StatutCommande.PAYEE, import_domain5.StatutCommande.ACCEPTEE, import_domain5.StatutCommande.EN_PREPARATION, import_domain5.StatutCommande.PRETE],
      [import_domain5.StatutCommande.EN_LIVRAISON]: [import_domain5.StatutCommande.PAYEE, import_domain5.StatutCommande.ACCEPTEE, import_domain5.StatutCommande.EN_PREPARATION, import_domain5.StatutCommande.PRETE, import_domain5.StatutCommande.EN_LIVRAISON],
      [import_domain5.StatutCommande.LIVREE]: [import_domain5.StatutCommande.PAYEE, import_domain5.StatutCommande.ACCEPTEE, import_domain5.StatutCommande.EN_PREPARATION, import_domain5.StatutCommande.PRETE, import_domain5.StatutCommande.EN_LIVRAISON, import_domain5.StatutCommande.LIVREE],
      [import_domain5.StatutCommande.REFUSEE]: [import_domain5.StatutCommande.PAYEE, import_domain5.StatutCommande.REFUSEE]
    };
    return chemin[statut] ?? [];
  }
};

// src/postgresql/DepotRestaurantsPrisma.ts
var import_domain7 = require("@ecoeats/domain");
var import_domain8 = require("@ecoeats/domain");
var import_domain9 = require("@ecoeats/domain");
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
        longitude: restaurant.position.longitude,
        imageUrl: restaurant.imageUrl
      },
      create: {
        id: restaurant.id,
        nom: restaurant.nom,
        adresse: restaurant.adresse,
        latitude: restaurant.position.latitude,
        longitude: restaurant.position.longitude,
        proprietaireId: restaurant.proprietaireId,
        imageUrl: restaurant.imageUrl
      }
    });
  }
  async trouverParId(id) {
    const row = await this.prisma.restaurant.findUnique({ where: { id } });
    if (!row) throw new import_domain9.RestaurantIntrouvableError(id);
    return new import_domain7.Restaurant(
      row.id,
      row.nom,
      row.adresse,
      new import_domain8.Coordonnees(row.latitude, row.longitude),
      row.proprietaireId,
      row.imageUrl
    );
  }
  async listerTous() {
    const rows = await this.prisma.restaurant.findMany();
    return rows.map((r) => this.mapToEntity(r));
  }
  async trouverParProprietaireId(proprietaireId) {
    const row = await this.prisma.restaurant.findFirst({ where: { proprietaireId } });
    return row ? this.mapToEntity(row) : null;
  }
  mapToEntity(row) {
    return new import_domain7.Restaurant(
      row.id,
      row.nom,
      row.adresse,
      new import_domain8.Coordonnees(row.latitude, row.longitude),
      row.proprietaireId,
      row.imageUrl
    );
  }
};

// src/postgresql/DepotPlatsPrisma.ts
var import_domain10 = require("@ecoeats/domain");
var import_domain11 = require("@ecoeats/domain");
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
        stockJournalier: plat.stockJournalier,
        imageUrl: plat.imageUrl,
        actif: plat.actif,
        categorie: plat.categorie
      },
      create: {
        id: plat.id,
        nom: plat.nom,
        description: plat.description,
        prixCentimes: plat.prix.enCentimes(),
        allergenes: plat.allergenes,
        stockJournalier: plat.stockJournalier,
        restaurantId: plat.restaurantId,
        imageUrl: plat.imageUrl,
        actif: plat.actif,
        categorie: plat.categorie
      }
    });
  }
  async trouverParId(id) {
    const row = await this.prisma.platMenu.findUnique({ where: { id } });
    if (!row) throw new import_domain11.PlatIntrouvableError(id);
    return new import_domain10.PlatMenu(
      row.id,
      row.nom,
      row.description,
      import_domain10.Money.fromCentimes(row.prixCentimes),
      row.allergenes,
      row.stockJournalier,
      row.restaurantId,
      row.imageUrl,
      row.actif,
      row.categorie
    );
  }
  async trouverParRestaurant(restaurantId) {
    const rows = await this.prisma.platMenu.findMany({ where: { restaurantId } });
    return rows.map(
      (r) => new import_domain10.PlatMenu(
        r.id,
        r.nom,
        r.description,
        import_domain10.Money.fromCentimes(r.prixCentimes),
        r.allergenes,
        r.stockJournalier,
        r.restaurantId,
        r.imageUrl,
        r.actif,
        r.categorie
      )
    );
  }
  async supprimer(id) {
    await this.prisma.platMenu.delete({ where: { id } });
  }
};

// src/postgresql/DepotClientsPrisma.ts
var import_domain12 = require("@ecoeats/domain");
var import_domain13 = require("@ecoeats/domain");
var DepotClientsPrisma = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async sauvegarder(client) {
    await this.prisma.client.upsert({
      where: { id: client.id },
      update: {
        nom: client.nom,
        email: client.email,
        adresse: client.adresse,
        telephone: client.telephone,
        pointsFidelite: client.getPointsFidelite()
      },
      create: {
        id: client.id,
        nom: client.nom,
        email: client.email,
        adresse: client.adresse,
        telephone: client.telephone,
        pointsFidelite: client.getPointsFidelite()
      }
    });
  }
  async trouverParId(id) {
    const row = await this.prisma.client.findUnique({ where: { id } });
    if (!row) throw new import_domain13.ClientIntrouvableError(id);
    return new import_domain12.Client(row.id, row.nom, row.email, row.adresse, row.telephone ?? void 0, row.pointsFidelite ?? 0);
  }
};

// src/postgresql/DepotLivreursPrisma.ts
var import_domain14 = require("@ecoeats/domain");
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
        longitude: livreur.position.longitude,
        estExpert: livreur.estExpert,
        commandesEnCoursIds: livreur.getCommandesEnCoursIds(),
        propositionsIds: livreur.getPropositionsIds(),
        currentRestaurantId: livreur.getCurrentRestaurantId()
      },
      create: {
        id: livreur.id,
        nom: livreur.nom,
        telephone: livreur.telephone,
        latitude: livreur.position.latitude,
        longitude: livreur.position.longitude,
        statut: livreur.getStatut(),
        portefeuilleCentimes: livreur.getPortefeuille().enCentimes(),
        estExpert: livreur.estExpert,
        commandesEnCoursIds: livreur.getCommandesEnCoursIds(),
        propositionsIds: livreur.getPropositionsIds(),
        currentRestaurantId: livreur.getCurrentRestaurantId()
      }
    });
  }
  async trouverParId(id) {
    const row = await this.prisma.livreur.findUnique({ where: { id } });
    if (!row) throw new Error(`Livreur introuvable : ${id}`);
    return this.reconstruire(row);
  }
  async listerDisponibles() {
    const rows = await this.prisma.livreur.findMany({
      where: { statut: import_domain14.StatutLivreur.DISPONIBLE }
    });
    return rows.map((r) => this.reconstruire(r));
  }
  async listerEligiblesPourRestaurant(restaurantId) {
    const rows = await this.prisma.livreur.findMany({
      where: {
        OR: [
          // Disponible
          { statut: import_domain14.StatutLivreur.DISPONIBLE },
          // En livraison mais potentiellement éligible (expert + même resto)
          {
            statut: import_domain14.StatutLivreur.EN_LIVRAISON,
            estExpert: true,
            currentRestaurantId: restaurantId
          }
        ]
      }
    });
    return rows.map((r) => this.reconstruire(r)).filter((l) => l.estDisponible(restaurantId));
  }
  async retirerPropositionDeTous(commandeId) {
    const livreursAvecProp = await this.prisma.livreur.findMany({
      where: {
        propositionsIds: {
          has: commandeId
        }
      }
    });
    for (const row of livreursAvecProp) {
      const nouvellesProps = row.propositionsIds.filter((id) => id !== commandeId);
      await this.prisma.livreur.update({
        where: { id: row.id },
        data: { propositionsIds: nouvellesProps }
      });
    }
  }
  reconstruire(row) {
    const livreur = new import_domain14.Livreur(
      row.id,
      row.nom,
      new import_domain14.Coordonnees(row.latitude, row.longitude),
      row.telephone,
      row.estExpert,
      import_domain14.Money.fromCentimes(row.portefeuilleCentimes),
      row.propositionsIds || [],
      row.currentRestaurantId || void 0
    );
    const statut = row.statut;
    if (statut === import_domain14.StatutLivreur.DISPONIBLE) {
      livreur.seDeclarerDisponible();
    } else if (statut === import_domain14.StatutLivreur.EN_LIVRAISON) {
      livreur.seDeclarerDisponible();
      for (const cmdId of row.commandesEnCoursIds || []) {
        try {
          livreur.prendreEnCharge(cmdId, row.currentRestaurantId || "");
        } catch (_) {
        }
      }
    } else {
      livreur.seDeclarerIndisponible();
    }
    return livreur;
  }
};

// src/postgresql/DepotComptesPrisma.ts
var import_domain15 = require("@ecoeats/domain");
var DepotComptesPrisma = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async sauvegarder(compte) {
    await this.prisma.compteUtilisateur.upsert({
      where: { id: compte.id },
      update: {
        email: compte.email,
        motDePasseHache: compte.motDePasseHache,
        role: compte.role,
        profilId: compte.profilId
      },
      create: {
        id: compte.id,
        email: compte.email,
        motDePasseHache: compte.motDePasseHache,
        role: compte.role,
        profilId: compte.profilId
      }
    });
  }
  async trouverParEmail(email) {
    const row = await this.prisma.compteUtilisateur.findUnique({ where: { email } });
    if (!row) return null;
    return new import_domain15.CompteUtilisateur(
      row.id,
      row.email,
      row.motDePasseHache,
      row.role,
      row.profilId
    );
  }
  async trouverParId(id) {
    const row = await this.prisma.compteUtilisateur.findUnique({ where: { id } });
    if (!row) return null;
    return new import_domain15.CompteUtilisateur(
      row.id,
      row.email,
      row.motDePasseHache,
      row.role,
      row.profilId
    );
  }
};

// src/postgresql/DepotAvisPrisma.ts
var import_domain16 = require("@ecoeats/domain");
var DepotAvisPrisma = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async sauvegarder(avis) {
    await this.prisma.avisLivreur.upsert({
      where: { commandeId: avis.commandeId },
      update: {
        note: avis.note,
        commentaire: avis.commentaire
      },
      create: {
        id: avis.id,
        commandeId: avis.commandeId,
        livreurId: avis.livreurId,
        clientId: avis.clientId,
        note: avis.note,
        commentaire: avis.commentaire,
        creeLe: avis.creeLe
      }
    });
  }
  async trouverParLivreur(livreurId) {
    const rows = await this.prisma.avisLivreur.findMany({
      where: { livreurId },
      orderBy: { creeLe: "desc" }
    });
    return rows.map((r) => new import_domain16.Avis(r.id, r.commandeId, r.livreurId, r.clientId, r.note, r.commentaire, r.creeLe));
  }
  async trouverParCommande(commandeId) {
    const r = await this.prisma.avisLivreur.findUnique({ where: { commandeId } });
    if (!r) return null;
    return new import_domain16.Avis(r.id, r.commandeId, r.livreurId, r.clientId, r.note, r.commentaire, r.creeLe);
  }
};

// src/postgresql/DepotFavorisPrisma.ts
var DepotFavorisPrisma = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async ajouterRestaurant(clientId, restaurantId) {
    await this.prisma.favoriRestaurant.upsert({
      where: { clientId_restaurantId: { clientId, restaurantId } },
      update: {},
      create: { clientId, restaurantId }
    });
  }
  async retirerRestaurant(clientId, restaurantId) {
    await this.prisma.favoriRestaurant.delete({
      where: { clientId_restaurantId: { clientId, restaurantId } }
    }).catch(() => {
    });
  }
  async listerRestaurants(clientId) {
    const rows = await this.prisma.favoriRestaurant.findMany({ where: { clientId } });
    return rows.map((r) => r.restaurantId);
  }
  async ajouterPlat(clientId, platId) {
    await this.prisma.favoriPlat.upsert({
      where: { clientId_platId: { clientId, platId } },
      update: {},
      create: { clientId, platId }
    });
  }
  async retirerPlat(clientId, platId) {
    await this.prisma.favoriPlat.delete({
      where: { clientId_platId: { clientId, platId } }
    }).catch(() => {
    });
  }
  async listerPlats(clientId) {
    const rows = await this.prisma.favoriPlat.findMany({ where: { clientId } });
    return rows.map((r) => r.platId);
  }
};

// src/services/CartographieHaversine.ts
var import_domain17 = require("@ecoeats/domain");
var CartographieHaversine = class {
  calculateur = new import_domain17.CalculDistanceService();
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
  DepotAvisPrisma,
  DepotClientsEnMemoire,
  DepotClientsPrisma,
  DepotCommandesEnMemoire,
  DepotCommandesPrisma,
  DepotComptesEnMemoire,
  DepotComptesPrisma,
  DepotFacturesEnMemoire,
  DepotFavorisPrisma,
  DepotLivreursEnMemoire,
  DepotLivreursPrisma,
  DepotPlatsEnMemoire,
  DepotPlatsPrisma,
  DepotRestaurantsEnMemoire,
  DepotRestaurantsPrisma,
  PaiementSimule
});
