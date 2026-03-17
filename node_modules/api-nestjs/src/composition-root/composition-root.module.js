"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositionRootModule = exports.PAIEMENT = exports.CARTOGRAPHIE = exports.DEPOT_FACTURES = exports.DEPOT_COMPTES = exports.DEPOT_LIVREURS = exports.DEPOT_CLIENTS = exports.DEPOT_PLATS = exports.DEPOT_RESTAURANTS = exports.DEPOT_COMMANDES = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const infrastructure_1 = require("@ecoeats/infrastructure");
exports.DEPOT_COMMANDES = 'DEPOT_COMMANDES';
exports.DEPOT_RESTAURANTS = 'DEPOT_RESTAURANTS';
exports.DEPOT_PLATS = 'DEPOT_PLATS';
exports.DEPOT_CLIENTS = 'DEPOT_CLIENTS';
exports.DEPOT_LIVREURS = 'DEPOT_LIVREURS';
exports.DEPOT_COMPTES = 'DEPOT_COMPTES';
exports.DEPOT_FACTURES = 'DEPOT_FACTURES';
exports.CARTOGRAPHIE = 'CARTOGRAPHIE';
exports.PAIEMENT = 'PAIEMENT';
const utiliserPostgres = process.env.DB_ADAPTER === 'postgresql';
const prismaClient = utiliserPostgres ? new client_1.PrismaClient() : null;
const providers = [
    {
        provide: exports.DEPOT_COMMANDES,
        useValue: utiliserPostgres ? new infrastructure_1.DepotCommandesPrisma(prismaClient) : new infrastructure_1.DepotCommandesEnMemoire(),
    },
    {
        provide: exports.DEPOT_RESTAURANTS,
        useValue: utiliserPostgres ? new infrastructure_1.DepotRestaurantsPrisma(prismaClient) : new infrastructure_1.DepotRestaurantsEnMemoire(),
    },
    {
        provide: exports.DEPOT_PLATS,
        useValue: utiliserPostgres ? new infrastructure_1.DepotPlatsPrisma(prismaClient) : new infrastructure_1.DepotPlatsEnMemoire(),
    },
    {
        provide: exports.DEPOT_CLIENTS,
        useValue: utiliserPostgres ? new infrastructure_1.DepotClientsPrisma(prismaClient) : new infrastructure_1.DepotClientsEnMemoire(),
    },
    {
        provide: exports.DEPOT_LIVREURS,
        useValue: utiliserPostgres ? new infrastructure_1.DepotLivreursPrisma(prismaClient) : new infrastructure_1.DepotLivreursEnMemoire(),
    },
    {
        provide: exports.DEPOT_COMPTES,
        useValue: utiliserPostgres ? new infrastructure_1.DepotComptesPrisma(prismaClient) : new infrastructure_1.DepotComptesEnMemoire(),
    },
    {
        provide: exports.DEPOT_FACTURES,
        useValue: new infrastructure_1.DepotFacturesEnMemoire(),
    },
    {
        provide: exports.CARTOGRAPHIE,
        useValue: new infrastructure_1.CartographieHaversine(),
    },
    {
        provide: exports.PAIEMENT,
        useValue: new infrastructure_1.PaiementSimule(),
    },
];
let CompositionRootModule = class CompositionRootModule {
    constructor() {
        console.log(`[NestJS Config] Adaptateur DB : ${utiliserPostgres ? 'PostgreSQL (Prisma)' : 'In-Memory'}`);
    }
};
exports.CompositionRootModule = CompositionRootModule;
exports.CompositionRootModule = CompositionRootModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: providers,
        exports: providers,
    }),
    __metadata("design:paramtypes", [])
], CompositionRootModule);
//# sourceMappingURL=composition-root.module.js.map