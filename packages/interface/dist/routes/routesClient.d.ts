import { Router } from "express";
import { ListerRestaurantsUseCase, VoirMenuRestaurantUseCase, AjouterAuPanierUseCase, PasserCommandeUseCase, PayerCommandeUseCase, ListerCommandesClientUseCase, GererFavorisUseCase, LaisserAvisLivreurUseCase } from "@ecoeats/application";
export declare function creerRoutesClient(deps: {
    listerRestaurants: ListerRestaurantsUseCase;
    voirMenu: VoirMenuRestaurantUseCase;
    ajouterAuPanier: AjouterAuPanierUseCase;
    passerCommande: PasserCommandeUseCase;
    payerCommande: PayerCommandeUseCase;
    listerCommandesClient: ListerCommandesClientUseCase;
    gererFavoris: GererFavorisUseCase;
    laisserAvis: LaisserAvisLivreurUseCase;
}): Router;
//# sourceMappingURL=routesClient.d.ts.map