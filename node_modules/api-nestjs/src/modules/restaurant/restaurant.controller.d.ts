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
        id: string;
        nom: string;
        prix: number;
    }>;
    modifierUnPlat(id: string, body: any): Promise<void>;
    supprimerUnPlat(id: string): Promise<void>;
    accepterLaCommande(id: string, body: {
        tempsPreparationMinutes: number;
    }): Promise<{
        statut: import("@ecoeats/domain").StatutCommande;
        tempsPreparation: number | null;
    }>;
    refuserLaCommande(id: string): Promise<{
        statut: import("@ecoeats/domain").StatutCommande;
    }>;
    marquerLaCommandePrete(id: string): Promise<{
        statut: import("@ecoeats/domain").StatutCommande;
    }>;
}
//# sourceMappingURL=restaurant.controller.d.ts.map