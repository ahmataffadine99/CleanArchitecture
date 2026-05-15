import { Coordonnees } from "../value-objects/Coordonnees";
export declare class CalculDistanceService {
    private static readonly RAYON_TERRE_KM;
    calculerKm(pointA: Coordonnees, pointB: Coordonnees): number;
    private versRadians;
}