import { Router, Request, Response, NextFunction } from 'express';
import { ListerRestaurantsUseCase, VoirMenuRestaurantUseCase, AjouterAuPanierUseCase, PasserCommandeUseCase, PayerCommandeUseCase, AjouterPlatUseCase, ModifierPlatUseCase, SupprimerPlatUseCase, AccepterCommandeUseCase, RefuserCommandeUseCase, MarquerCommandePreteUseCase, ListerCommandesRestaurantUseCase, ModifierRestaurantUseCase, ObtenirMonRestaurantUseCase, ChangerStatutLivreurUseCase, AttribuerLivraisonUseCase, TerminerLivraisonUseCase, InscriptionUseCase, ConnexionUseCase } from '@ecoeats/application';

declare function creerRoutesClient(deps: {
    listerRestaurants: ListerRestaurantsUseCase;
    voirMenu: VoirMenuRestaurantUseCase;
    ajouterAuPanier: AjouterAuPanierUseCase;
    passerCommande: PasserCommandeUseCase;
    payerCommande: PayerCommandeUseCase;
}): Router;

declare function creerRoutesRestaurant(deps: {
    ajouterPlat: AjouterPlatUseCase;
    modifierPlat: ModifierPlatUseCase;
    supprimerPlat: SupprimerPlatUseCase;
    accepterCommande: AccepterCommandeUseCase;
    refuserCommande: RefuserCommandeUseCase;
    marquerPrete: MarquerCommandePreteUseCase;
    listerCommandes: ListerCommandesRestaurantUseCase;
    modifierRestaurant: ModifierRestaurantUseCase;
    obtenirMonResto: ObtenirMonRestaurantUseCase;
    servicePanier: AjouterAuPanierUseCase;
}): Router;

declare function creerRoutesLivreur(deps: {
    changerStatut: ChangerStatutLivreurUseCase;
    attribuerLivraison: AttribuerLivraisonUseCase;
    terminerLivraison: TerminerLivraisonUseCase;
}): Router;

declare function creerRoutesAuth(deps: {
    inscription: InscriptionUseCase;
    connexion: ConnexionUseCase;
}): Router;

declare function gestionnaireErreurs(err: Error, req: Request, res: Response, next: NextFunction): void;

declare global {
    namespace Express {
        interface Request {
            user?: {
                sub: string;
                role: string;
                profilId: string;
                email: string;
            };
        }
    }
}
declare function creerAuthMiddleware(secretJwt: string): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
declare function requireRole(role: string): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;

export { creerAuthMiddleware, creerRoutesAuth, creerRoutesClient, creerRoutesLivreur, creerRoutesRestaurant, gestionnaireErreurs, requireRole };
