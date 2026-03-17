import { Router, Request, Response, NextFunction } from "express";
import { InscriptionUseCase, ConnexionUseCase } from "@ecoeats/application";

export function creerRoutesAuth(deps: {
  inscription: InscriptionUseCase;
  connexion: ConnexionUseCase;
}): Router {
  const router = Router();

  // POST /auth/register
  router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nom, email, motDePasse, role } = req.body;
      const { compte } = await deps.inscription.executer({ nom, email, motDePasse, role });
      res.status(201).json({
        id: compte.id,
        email: compte.email,
        role: compte.role,
        profilId: compte.profilId,
      });
    } catch (err) { next(err); }
  });

  // POST /auth/login
  router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, motDePasse } = req.body;
      const resultat = await deps.connexion.executer({ email, motDePasse });
      res.json(resultat); // Retourne le token JWT et les infos
    } catch (err) { next(err); }
  });

  return router;
}
