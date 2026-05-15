import { Router } from "express";
import { ChangerStatutLivreurUseCase, AttribuerLivraisonUseCase, TerminerLivraisonUseCase, ObtenirLivreurUseCase, AccepterLivraisonUseCase, RefuserLivraisonUseCase, ObtenirPropositionsLivreurUseCase, RecupererCommandeUseCase, ObtenirCommandeUseCase, ListerHistoriqueLivreurUseCase, ObtenirAvisLivreurUseCase } from "@ecoeats/application";
export declare function creerRoutesLivreur(deps: {
    changerStatut: ChangerStatutLivreurUseCase;
    attribuerLivraison: AttribuerLivraisonUseCase;
    terminerLivraison: TerminerLivraisonUseCase;
    obtenirLivreur: ObtenirLivreurUseCase;
    accepterLivraison: AccepterLivraisonUseCase;
    refuserLivraison: RefuserLivraisonUseCase;
    obtenirPropositions: ObtenirPropositionsLivreurUseCase;
    recupererCommande: RecupererCommandeUseCase;
    obtenirCommande: ObtenirCommandeUseCase;
    listerHistorique: ListerHistoriqueLivreurUseCase;
    obtenirAvis: ObtenirAvisLivreurUseCase;
}): Router;