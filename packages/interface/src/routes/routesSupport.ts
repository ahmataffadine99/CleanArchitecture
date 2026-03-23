import { Router, Request, Response } from "express";
import { 
  CreerTicketUseCase,
  EnvoyerMessageTicketUseCase,
  ListerTicketsUseCase
} from "@ecoeats/application";

export function routerSupport(
  creerTicket: CreerTicketUseCase,
  envoyerMessageTicket: EnvoyerMessageTicketUseCase,
  listerTickets: ListerTicketsUseCase
) {
  const router = Router();

  // POST /api/support/tickets
  router.post("/tickets", async (req, res) => {
    try {
      const { auteurId, titre, messageInitial } = req.body;
      const ticket = await creerTicket.executer(auteurId, titre, messageInitial);
      res.json(ticket);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/support/tickets/:auteurId
  router.get("/tickets/:auteurId", async (req, res) => {
    try {
      const { auteurId } = req.params;
      const tickets = await listerTickets.executer(auteurId);
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/support/tickets/:id/message
  router.post("/tickets/:id/message", async (req, res) => {
    try {
      const { id } = req.params;
      const { contenu, auteurId } = req.body;
      const message = await envoyerMessageTicket.executer(id, auteurId, contenu, false);
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
