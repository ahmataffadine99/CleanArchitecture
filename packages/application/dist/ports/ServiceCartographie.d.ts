import { Coordonnees } from "@ecoeats/domain";
export interface ServiceCartographie {
    calculerDistanceKm(pointA: Coordonnees, pointB: Coordonnees): number;
}