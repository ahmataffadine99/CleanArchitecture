import { ChangerStatutLivreurUseCase, AttribuerLivraisonUseCase, TerminerLivraisonUseCase } from '@ecoeats/application';
export declare class LivreurController {
    private readonly changerStatut;
    private readonly attribuerLivraison;
    private readonly terminerLivraison;
    constructor(changerStatut: ChangerStatutLivreurUseCase, attribuerLivraison: AttribuerLivraisonUseCase, terminerLivraison: TerminerLivraisonUseCase);
    updateStatut(id: string, body: {
        statut: string;
    }): Promise<{
        statut: string;
    }>;
    attribuerLeLivreur(id: string): Promise<{
        commandeId: any;
        livreurId: any;
        livreurNom: any;
        distanceKm: any;
    }>;
    marquerCommandeLivree(id: string): Promise<{
        commandeId: any;
        statut: any;
        livreurPortefeuille: any;
    }>;
}
//# sourceMappingURL=livreur.controller.d.ts.map