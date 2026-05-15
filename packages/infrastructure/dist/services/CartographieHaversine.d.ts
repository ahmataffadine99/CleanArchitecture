import { Coordonnees } from "@ecoeats/domain";
import { ServiceCartographie } from "@ecoeats/application";
export declare class CartographieHaversine implements ServiceCartographie {
    private readonly calculateur;
    calculerDistanceKm(pointA: Coordonnees, pointB: Coordonnees): number;
}