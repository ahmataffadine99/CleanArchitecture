import { DepotCommandes } from "../../ports/DepotCommandes";
import { DepotLivreurs } from "../../ports/DepotLivreurs";
import { DepotRestaurants } from "../../ports/DepotRestaurants";
import { ServiceCartographie } from "../../ports/ServiceCartographie";
export type PropositionDetaillee = {
    commandeId: string;
    restaurantNom: string;
    restaurantAdresse: string;
    clientAdresse: string;
    tempsPreparationEstime?: number;
    montantLivraison: number;
    distanceApprocheKm: number;
    distanceLivraisonKm: number;
};
export declare class ObtenirPropositionsLivreurUseCase {
    private readonly depotLivreurs;
    private readonly depotCommandes;
    private readonly depotRestaurants;
    private readonly cartographie;
    constructor(depotLivreurs: DepotLivreurs, depotCommandes: DepotCommandes, depotRestaurants: DepotRestaurants, cartographie: ServiceCartographie);
    executer(livreurId: string): Promise<PropositionDetaillee[]>;
}