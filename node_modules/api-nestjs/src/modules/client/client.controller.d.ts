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
    getRestaurants(): Promise<{
        id: string;
        nom: string;
        adresse: string;
        position: {
            lat: number;
            lon: number;
        };
    }[]>;
    getMenu(id: string): Promise<{
        disponibles: {
            id: any;
            nom: any;
            description: any;
            prix: any;
            allergenes: any;
            stock: any;
        }[];
        rupture: {
            id: any;
            nom: any;
            description: any;
            prix: any;
            allergenes: any;
            stock: any;
        }[];
    }>;
    ajouterArticlePanier(rawDto: AjoutArticleDto): Promise<{
        restaurantId: string | null;
        articles: {
            platId: string;
            nom: string;
            prix: number;
            quantite: number;
        }[];
        total: number;
    }>;
    viderPanier(clientId: string): void;
    passerLaCommande(dto: PasserCommandeDto): Promise<{
        id: string;
        statut: import("@ecoeats/domain").StatutCommande;
        total: number;
        detail: {
            plats: number;
            livraison: number;
            service: number;
        };
    }>;
    payerLaCommande(id: string, dto: PayerCommandeDto): Promise<{
        factureId: string;
        total: number;
        detail: string;
    }>;
}
export {};
//# sourceMappingURL=client.controller.d.ts.map