import { Router, Request, Response } from "express";
import { 
  ObtenirStatsGlobalesUseCase, 
  ObtenirTousLesComptesUseCase, 
  ChangerStatutCompteUseCase,
  ListerRestaurantsUseCase,
  ListerToutesLesCommandesUseCase,
  ListerTicketsUseCase,
  EnvoyerMessageTicketUseCase,
  CloturerTicketUseCase,
  ObtenirStatsRestaurantUseCase
} from "@ecoeats/application";

export function routerAdmin(
  obtenirStatsGlobales: ObtenirStatsGlobalesUseCase,
  obtenirTousLesComptes: ObtenirTousLesComptesUseCase,
  changerStatutCompte: ChangerStatutCompteUseCase,
  listerRestaurants: ListerRestaurantsUseCase,
  listerToutesLesCommandes: ListerToutesLesCommandesUseCase,
  listerTickets: ListerTicketsUseCase,
  envoyerMessageTicket: EnvoyerMessageTicketUseCase,
  cloturerTicket: CloturerTicketUseCase,
  obtenirStatsRestaurant: ObtenirStatsRestaurantUseCase
) {
  const router = Router();

  // GET /api/admin/stats
  router.get("/stats", async (req, res) => {
    try {
      const stats = await obtenirStatsGlobales.executer();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/admin/restaurants/:id/stats
  router.get("/restaurants/:id/stats", async (req, res) => {
    try {
      const { id } = req.params;
      const stats = await obtenirStatsRestaurant.executer(id);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/admin/comptes
  router.get("/comptes", async (req, res) => {
    try {
      const comptes = await obtenirTousLesComptes.executer();
      res.json(comptes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/admin/restaurants
  router.get("/restaurants", async (req, res) => {
    try {
      const restaurants = await listerRestaurants.executer();
      res.json(restaurants);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/admin/commandes
  router.get("/commandes", async (req, res) => {
    try {
      const commandes = await listerToutesLesCommandes.executer();
      res.json(commandes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- SUPPORT ---

  // GET /api/admin/tickets
  router.get("/tickets", async (req, res) => {
    try {
      const tickets = await listerTickets.executer();
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/admin/tickets/:id/message
  router.post("/tickets/:id/message", async (req, res) => {
    try {
      const { id } = req.params;
      const { contenu, auteurId } = req.body;
      const message = await envoyerMessageTicket.executer(id, auteurId, contenu, true);
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/admin/tickets/:id/cloturer
  router.post("/tickets/:id/cloturer", async (req, res) => {
    try {
      const { id } = req.params;
      await cloturerTicket.executer(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/admin/comptes/:id/statut
  router.post("/comptes/:id/statut", async (req, res) => {
    try {
      const { id } = req.params;
      const { estActif } = req.body;
      await changerStatutCompte.executer(id, estActif);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
