import { Global, Module, Provider } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import {
  DepotCommandesEnMemoire, DepotRestaurantsEnMemoire, DepotPlatsEnMemoire,
  DepotClientsEnMemoire, DepotLivreursEnMemoire, DepotFacturesEnMemoire, DepotComptesEnMemoire,
  CartographieHaversine, PaiementSimule,
  DepotCommandesPrisma, DepotRestaurantsPrisma, DepotPlatsPrisma, DepotClientsPrisma, DepotLivreursPrisma, DepotComptesPrisma
} from '@ecoeats/infrastructure';

export const DEPOT_COMMANDES = 'DEPOT_COMMANDES';
export const DEPOT_RESTAURANTS = 'DEPOT_RESTAURANTS';
export const DEPOT_PLATS = 'DEPOT_PLATS';
export const DEPOT_CLIENTS = 'DEPOT_CLIENTS';
export const DEPOT_LIVREURS = 'DEPOT_LIVREURS';
export const DEPOT_COMPTES = 'DEPOT_COMPTES';
export const DEPOT_FACTURES = 'DEPOT_FACTURES';
export const CARTOGRAPHIE = 'CARTOGRAPHIE';
export const PAIEMENT = 'PAIEMENT';

const utiliserPostgres = process.env.DB_ADAPTER === 'postgresql';
const prismaClient = utiliserPostgres ? new PrismaClient() : null;

const providers: Provider[] = [
  {
    provide: DEPOT_COMMANDES,
    useValue: utiliserPostgres ? new DepotCommandesPrisma(prismaClient!) : new DepotCommandesEnMemoire(),
  },
  {
    provide: DEPOT_RESTAURANTS,
    useValue: utiliserPostgres ? new DepotRestaurantsPrisma(prismaClient!) : new DepotRestaurantsEnMemoire(),
  },
  {
    provide: DEPOT_PLATS,
    useValue: utiliserPostgres ? new DepotPlatsPrisma(prismaClient!) : new DepotPlatsEnMemoire(),
  },
  {
    provide: DEPOT_CLIENTS,
    useValue: utiliserPostgres ? new DepotClientsPrisma(prismaClient!) : new DepotClientsEnMemoire(),
  },
  {
    provide: DEPOT_LIVREURS,
    useValue: utiliserPostgres ? new DepotLivreursPrisma(prismaClient!) : new DepotLivreursEnMemoire(),
  },
  {
    provide: DEPOT_COMPTES,
    useValue: utiliserPostgres ? new DepotComptesPrisma(prismaClient!) : new DepotComptesEnMemoire(),
  },
  {
    provide: DEPOT_FACTURES,
    useValue: new DepotFacturesEnMemoire(),
  },
  {
    provide: CARTOGRAPHIE,
    useValue: new CartographieHaversine(),
  },
  {
    provide: PAIEMENT,
    useValue: new PaiementSimule(),
  },
];

@Global()
@Module({
  providers: providers,
  exports: providers,
})
export class CompositionRootModule {
  constructor() {
    console.log(`[NestJS Config] Adaptateur DB : ${utiliserPostgres ? 'PostgreSQL (Prisma)' : 'In-Memory'}`);
  }
}
