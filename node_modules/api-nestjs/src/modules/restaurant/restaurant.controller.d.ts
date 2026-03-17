import { AjouterPlatUseCase, ModifierPlatUseCase, SupprimerPlatUseCase, AccepterCommandeUseCase, RefuserCommandeUseCase, MarquerCommandePreteUseCase } from '@ecoeats/application';
export declare class RestaurantController {
    private readonly ajouterPlat;
    private readonly modifierPlat;
    private readonly supprimerPlat;
    private readonly accepterCommande;
    private readonly refuserCommande;
    private readonly marquerPrete;
    constructor(ajouterPlat: AjouterPlatUseCase, modifierPlat: ModifierPlatUseCase, supprimerPlat: SupprimerPlatUseCase, accepterCommande: AccepterCommandeUseCase, refuserCommande: RefuserCommandeUseCase, marquerPrete: MarquerCommandePreteUseCase);
    ajouterUnPlat(id: string, body: any): Promise<{
        id: any;
        nom: any;
        prix: any;
    }>;
    modifierUnPlat(id: string, body: any): Promise<void>;
    supprimerUnPlat(id: string): Promise<void>;
    accepterLaCommande(id: string, body: {
        tempsPreparationMinutes: number;
    }): Promise<{
        statut: any;
        tempsPreparation: any;
    }>;
    refuserLaCommande(id: string): Promise<{
        statut: any;
    }>;
    marquerLaCommandePrete(id: string): Promise<{
        statut: any;
    }>;
}
//# sourceMappingURL=restaurant.controller.d.ts.map