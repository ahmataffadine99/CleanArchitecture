"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coordonnees = void 0;
// Coordonnées GPS — immuable
class Coordonnees {
    latitude;
    longitude;
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
        if (latitude < -90 || latitude > 90) {
            throw new Error(`Latitude invalide : ${latitude}`);
        }
        if (longitude < -180 || longitude > 180) {
            throw new Error(`Longitude invalide : ${longitude}`);
        }
    }
    estEgal(autre) {
        return this.latitude === autre.latitude && this.longitude === autre.longitude;
    }
    toString() {
        return `(${this.latitude}, ${this.longitude})`;
    }
}
exports.Coordonnees = Coordonnees;
//# sourceMappingURL=Coordonnees.js.map