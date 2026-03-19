import { Livreur } from "../entities/Livreur";
import { Coordonnees } from "../value-objects/Coordonnees";
export declare class SelectionLivreurService {
    private readonly calculDistance;
    trouverLePlusProche(livreurs: Livreur[], positionRestaurant: Coordonnees, restaurantId: string): Livreur;
}
//# sourceMappingURL=SelectionLivreurService.d.ts.map