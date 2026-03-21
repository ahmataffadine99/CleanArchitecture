import { Router } from "express";
import { AjouterPlatUseCase, ModifierPlatUseCase, SupprimerPlatUseCase, AccepterCommandeUseCase, RefuserCommandeUseCase, MarquerCommandePreteUseCase, ListerCommandesRestaurantUseCase, ModifierRestaurantUseCase, ObtenirMonRestaurantUseCase, AjouterAuPanierUseCase } from "@ecoeats/application";
export declare function creerRoutesRestaurant(deps: {
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
//# sourceMappingURL=routesRestaurant.d.ts.map