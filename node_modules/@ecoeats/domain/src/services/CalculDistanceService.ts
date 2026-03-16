import { Coordonnees } from "../value-objects/Coordonnees";

// Calcul de la distance à vol d'oiseau via la formule de Haversine
export class CalculDistanceService {
  private static readonly RAYON_TERRE_KM = 6371;

  calculerKm(pointA: Coordonnees, pointB: Coordonnees): number {
    const latARad = this.versRadians(pointA.latitude);
    const latBRad = this.versRadians(pointB.latitude);
    const deltaLat = this.versRadians(pointB.latitude - pointA.latitude);
    const deltaLon = this.versRadians(pointB.longitude - pointA.longitude);

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(latARad) * Math.cos(latBRad) * Math.sin(deltaLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return CalculDistanceService.RAYON_TERRE_KM * c;
  }

  private versRadians(degres: number): number {
    return (degres * Math.PI) / 180;
  }
}
