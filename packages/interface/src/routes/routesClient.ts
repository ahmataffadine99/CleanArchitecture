import { Router, Request, Response, NextFunction } from "express";
import {
  ListerRestaurantsUseCase,
  VoirMenuRestaurantUseCase,
  AjouterAuPanierUseCase,
  PasserCommandeUseCase,
  PayerCommandeUseCase,
  ListerCommandesClientUseCase,
  GererFavorisUseCase,
  LaisserAvisLivreurUseCase,
  ObtenirFavorisDetailsUseCase,
  MettreAJourProfilClientUseCase,
  ObtenirProfilClientUseCase,
} from "@ecoeats/application";

export function creerRoutesClient(deps: {
  listerRestaurants: ListerRestaurantsUseCase;
  voirMenu: VoirMenuRestaurantUseCase;
  ajouterAuPanier: AjouterAuPanierUseCase;
  passerCommande: PasserCommandeUseCase;
  payerCommande: PayerCommandeUseCase;
  listerCommandesClient: ListerCommandesClientUseCase;
  gererFavoris: GererFavorisUseCase;
  laisserAvis: LaisserAvisLivreurUseCase;
  obtenirFavorisDetails: ObtenirFavorisDetailsUseCase;
  mettreAJourProfil: MettreAJourProfilClientUseCase;
  obtenirProfil: ObtenirProfilClientUseCase;
}): Router {
  const router = Router();

  // GET /restaurants
  router.get("/restaurants", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lat, lon, rayon, cat } = req.query;
      const filtres = {
        latitude: lat ? parseFloat(lat as string) : undefined,
        longitude: lon ? parseFloat(lon as string) : undefined,
        rayonKm: rayon ? parseFloat(rayon as string) : undefined,
        categorie: cat as string | undefined,
      };
      
      const restaurants = await deps.listerRestaurants.executer(filtres);
      res.json(restaurants.map(r => ({
        id: r.id, nom: r.nom, adresse: r.adresse,
        position: { lat: r.position.latitude, lon: r.position.longitude },
        categories: r.categories,
        imageUrl: r.imageUrl
      })));
    } catch (err) { next(err); }
  });

  // GET /restaurants/:id/menu
  router.get("/restaurants/:id/menu", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { disponibles, rupture } = await deps.voirMenu.executer(req.params.id);
      const formater = (p: any) => ({
        id: p.id, nom: p.nom, description: p.description,
        prix: p.prix.enEuros(), allergenes: p.allergenes, stock: p.stockJournalier,
        imageUrl: p.imageUrl,
        actif: p.actif,
        categorie: p.categorie,
      });

      res.json({ 
        disponibles: disponibles.map(formater), 
        rupture: rupture.map(formater) 
      });
    } catch (err) { next(err); }
  });

  // POST /panier/articles
  router.post("/panier/articles", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clientId, platId, quantite } = req.body;
      const panier = await deps.ajouterAuPanier.executer({ clientId, platId, quantite });
      res.status(201).json({
        restaurantId: panier.getRestaurantId(),
        articles: panier.getArticles().map(a => ({
          platId: a.menuItemId, nom: a.nom,
          prix: a.prixSnapshot.enEuros(), quantite: a.quantite,
        })),
        total: panier.prixTotal().enEuros(),
      });
    } catch (err) { next(err); }
  });

  // DELETE /panier/:clientId
  router.delete("/panier/:clientId", (req: Request, res: Response) => {
    deps.ajouterAuPanier.viderPanier(req.params.clientId);
    res.status(204).send();
  });

  // DELETE /panier/:clientId/articles/:platId
  router.delete("/panier/:clientId/articles/:platId", (req: Request, res: Response) => {
    deps.ajouterAuPanier.retirerDuPanier(req.params.clientId, req.params.platId);
    res.status(204).send();
  });

  // POST /commandes
  router.post("/commandes", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clientId, adresseLivraison, latitude, longitude } = req.body;
      const panier = deps.ajouterAuPanier.getPanier(clientId);
      if (!panier || panier.estVide()) {
        return res.status(400).json({ message: "Le panier est vide." });
      }
      const commande = await deps.passerCommande.executer({ clientId, panier, adresseLivraison, latitude, longitude });
      res.status(201).json({
        id: commande.id, statut: commande.getStatut(),
        total: commande.prixTotal().enEuros(),
        detail: {
          plats: commande.getPrixPlats().enEuros(),
          livraison: commande.getFraisLivraison().enEuros(),
          service: commande.getFraisService().enEuros(),
        },
      });
    } catch (err) { next(err); }
  });

  // POST /commandes/:id/payer
  router.post("/commandes/:id/payer", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clientId } = req.body;
      const { facture } = await deps.payerCommande.executer({ commandeId: req.params.id, clientId });
      res.json({ factureId: facture.id, total: facture.total.enEuros(), detail: facture.afficher() });
    } catch (err) { next(err); }
  });

  // GET /clients/:clientId/commandes
  router.get("/clients/:clientId/commandes", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commandes = await deps.listerCommandesClient.executer(req.params.clientId);
      res.json(commandes.map((c: any) => {
        const isPlain = typeof c.getStatut !== 'function';
        
        return {
          id: c.id,
          restaurantId: c.restaurantId,
          restaurantNom: c.restaurantNom,
          livreurNom: c.livreurNom,
          statut: isPlain ? c.statut : c.getStatut(),
          prixPlatsCentimes: isPlain ? (c.prixPlatsCentimes ?? 0) : c.getPrixPlats().enCentimes(),
          fraisLivCentimes: isPlain ? (c.fraisLivCentimes ?? 0) : c.getFraisLivraison().enCentimes(),
          fraisServiceCentimes: isPlain ? (c.fraisServiceCentimes ?? 0) : c.getFraisService().enCentimes(),
          totalCentimes: isPlain ? (c.totalCentimes ?? (c.prixTotal * 100)) : c.prixTotal().enCentimes(),
          creeLe: isPlain ? c.creeLe : c.getCreeLe(),
          tempsPreparationEstime: isPlain ? c.tempsPreparationEstime : c.getTempsPreparation(),
          adresseLivraison: isPlain ? c.adresseLivraison : c.getAdresseLivraison(),
          articles: (isPlain ? c.articles : c.getArticles()).map((a: any) => ({
            nom: a.nom,
            quantite: a.quantite
          }))
        };
      }));
    } catch (err) { next(err); }
  });

  // GET /clients/:clientId/points - Points de fidélité du client
  router.get("/clients/:clientId/points", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientId = req.params.clientId;
      const commandes = await deps.listerCommandesClient.executer(clientId);
      // Calculer le total de points depuis les commandes payées/terminées
      const totalPoints = commandes
        .filter((c: any) => {
          const s = typeof c.getStatut === 'function' ? c.getStatut() : c.statut;
          return ['PAYEE', 'ACCEPTEE', 'EN_PREPARATION', 'PRETE', 'EN_LIVRAISON', 'LIVREE'].includes(s);
        })
        .reduce((sum: number, c: any) => {
          const isPlain = typeof c.prixTotal !== 'function';
          const totalCentimes = isPlain ? (c.totalCentimes ?? (c.prixTotal * 100)) : c.prixTotal().enCentimes();
          return sum + Math.floor(totalCentimes / 100);
        }, 0);
      res.json({ pointsFidelite: totalPoints });
    } catch (err) { next(err); }
  });

  // --- FAVORIS ---
  // Favoris Restaurants
  router.get('/favoris/restaurants/:clientId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ids = await deps.gererFavoris.listerRestaurants(req.params.clientId);
      res.json(ids);
    } catch (err) { next(err); }
  });

  router.post('/favoris/restaurants', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deps.gererFavoris.ajouterRestaurant(req.body.clientId, req.body.restaurantId);
      res.status(201).send();
    } catch (err) { next(err); }
  });

  router.delete('/favoris/restaurants/:clientId/:restaurantId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deps.gererFavoris.retirerRestaurant(req.params.clientId, req.params.restaurantId);
      res.status(204).send();
    } catch (err) { next(err); }
  });

  // Favoris Plats
  router.get('/favoris/plats/:clientId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ids = await deps.gererFavoris.listerPlats(req.params.clientId);
      res.json(ids);
    } catch (err) { next(err); }
  });

  router.post('/favoris/plats', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deps.gererFavoris.ajouterPlat(req.body.clientId, req.body.platId);
      res.status(201).send();
    } catch (err) { next(err); }
  });

  router.delete('/favoris/plats/:clientId/:platId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deps.gererFavoris.retirerPlat(req.params.clientId, req.params.platId);
      res.status(204).send();
    } catch (err) { next(err); }
  });

  router.get('/favoris/details/:clientId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { restaurants, plats } = await deps.obtenirFavorisDetails.executer(req.params.clientId);
      res.json({
        restaurants: restaurants.map(r => ({
          id: r.id, nom: r.nom, adresse: r.adresse,
          position: { lat: r.position.latitude, lon: r.position.longitude },
          imageUrl: r.imageUrl
        })),
        plats: plats.map(p => ({
          id: p.id, nom: p.nom, description: p.description,
          prix: p.prix.enEuros(), imageUrl: p.imageUrl, restaurantId: p.restaurantId
        }))
      });
    } catch (err) { next(err); }
  });

  // Avis
  router.post("/commandes/:id/avis", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { note, commentaire } = req.body;
      await deps.laisserAvis.executer({ commandeId: req.params.id, note, commentaire });
      res.status(201).send();
    } catch (err) { next(err); }
  });

  // Profil
  router.put("/profil", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clientId, nom, email, telephone } = req.body;
      await deps.mettreAJourProfil.executer({ clientId, nom, email, telephone });
      res.status(204).send();
    } catch (err) { next(err); }
  });

  router.get("/profil/:clientId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profil = await deps.obtenirProfil.executer(req.params.clientId);
      res.json(profil);
    } catch (err) { next(err); }
  });

  return router;
}
