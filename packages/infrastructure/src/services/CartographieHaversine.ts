import { Coordonnees } from "@ecoeats/domain";
import { CalculDistanceService } from "@ecoeats/domain";
import { ServiceCartographie } from "@ecoeats/application";

export class CartographieHaversine implements ServiceCartographie {
  private readonly calculateur = new CalculDistanceService();

  calculerDistanceKm(pointA: Coordonnees, pointB: Coordonnees): number {
    return this.calculateur.calculerKm(pointA, pointB);
  }
}
