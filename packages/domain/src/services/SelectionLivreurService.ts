import { Livreur } from "../entities/Livreur";
import { Coordonnees } from "../value-objects/Coordonnees";
import { CalculDistanceService } from "./CalculDistanceService";
import { AucunLivreurDisponibleError } from "../errors/AucunLivreurDisponibleError";

export class SelectionLivreurService {
  private readonly calculDistance = new CalculDistanceService();

  trouverLePlusProche(
    livreurs: Livreur[],
    positionRestaurant: Coordonnees,
    restaurantId: string
  ): Livreur {
    const dispos = livreurs.filter(l => l.estDisponible(restaurantId));

    if (dispos.length === 0) {
      throw new AucunLivreurDisponibleError(restaurantId);
    }

    return dispos.reduce((lePlusProche, livreur) => {
      const distActuel = this.calculDistance.calculerKm(livreur.position, positionRestaurant);
      const distPlusProche = this.calculDistance.calculerKm(lePlusProche.position, positionRestaurant);
      return distActuel < distPlusProche ? livreur : lePlusProche;
    });
  }
}
