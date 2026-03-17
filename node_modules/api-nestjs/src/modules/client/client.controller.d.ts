import { ListerRestaurantsUseCase, VoirMenuRestaurantUseCase, AjouterAuPanierUseCase, PasserCommandeUseCase, PayerCommandeUseCase } from '@ecoeats/application';
declare class AjoutArticleDto {
    clientId: string;
    platId: string;
    quantite: number;
}
declare class PasserCommandeDto {
    clientId: string;
    adresseLivraison: string;
}
declare class PayerCommandeDto {
    clientId: string;
}
export declare class ClientController {
    private readonly listerRestaurants;
    private readonly voirMenu;
    private readonly ajouterAuPanier;
    private readonly passerCommande;
    private readonly payerCommande;
    constructor(listerRestaurants: ListerRestaurantsUseCase, voirMenu: VoirMenuRestaurantUseCase, ajouterAuPanier: AjouterAuPanierUseCase, passerCommande: PasserCommandeUseCase, payerCommande: PayerCommandeUseCase);
    getRestaurants(): Promise<any>;
    getMenu(id: string): Promise<{
        disponibles: any;
        rupture: any;
    }>;
    ajouterArticlePanier(rawDto: AjoutArticleDto): Promise<{
        restaurantId: any;
        articles: any;
        total: any;
    }>;
    viderPanier(clientId: string): void;
    passerLaCommande(dto: PasserCommandeDto): Promise<{
        id: any;
        statut: any;
        total: any;
        detail: {
            plats: any;
            livraison: any;
            service: any;
        };
    }>;
    payerLaCommande(id: string, dto: PayerCommandeDto): Promise<{
        factureId: any;
        total: any;
        detail: any;
    }>;
}
export {};
//# sourceMappingURL=client.controller.d.ts.map