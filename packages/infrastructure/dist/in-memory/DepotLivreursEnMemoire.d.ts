import { Livreur } from "@ecoeats/domain";
import { DepotLivreurs } from "@ecoeats/application";
export declare class DepotLivreursEnMemoire implements DepotLivreurs {
    private readonly store;
    sauvegarder(livreur: Livreur): Promise<void>;
    trouverParId(id: string): Promise<Livreur>;
    listerDisponibles(): Promise<Livreur[]>;
    retirerPropositionDeTous(commandeId: string): Promise<void>;
}