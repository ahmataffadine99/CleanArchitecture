"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculDistanceService = void 0;
class CalculDistanceService {
    static RAYON_TERRE_KM = 6371;
    calculerKm(pointA, pointB) {
        const latARad = this.versRadians(pointA.latitude);
        const latBRad = this.versRadians(pointB.latitude);
        const deltaLat = this.versRadians(pointB.latitude - pointA.latitude);
        const deltaLon = this.versRadians(pointB.longitude - pointA.longitude);
        const a = Math.sin(deltaLat / 2) ** 2 +
            Math.cos(latARad) * Math.cos(latBRad) * Math.sin(deltaLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return CalculDistanceService.RAYON_TERRE_KM * c;
    }
    versRadians(degres) {
        return (degres * Math.PI) / 180;
    }
}
exports.CalculDistanceService = CalculDistanceService;