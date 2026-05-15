export class Coordonnees {
  constructor(
    readonly latitude: number,
    readonly longitude: number
  ) {
    if (latitude < -90 || latitude > 90) {
      throw new Error(`Latitude invalide : ${latitude}`);
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error(`Longitude invalide : ${longitude}`);
    }
  }

  estEgal(autre: Coordonnees): boolean {
    return this.latitude === autre.latitude && this.longitude === autre.longitude;
  }

  toString(): string {
    return `(${this.latitude}, ${this.longitude})`;
  }
}
