import { Coordonnees } from "@ecoeats/domain";

// Abstraction pour une API Maps — l'infra fournit l'implémentation
export interface ServiceCartographie {
  calculerDistanceKm(pointA: Coordonnees, pointB: Coordonnees): number;
}
