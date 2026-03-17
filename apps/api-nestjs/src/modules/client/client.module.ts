import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import {
  ListerRestaurantsUseCase,
  VoirMenuRestaurantUseCase,
  AjouterAuPanierUseCase,
  PasserCommandeUseCase,
  PayerCommandeUseCase
} from '@ecoeats/application';
import {
  DEPOT_RESTAURANTS,
  DEPOT_PLATS,
  DEPOT_CLIENTS,
  DEPOT_COMMANDES,
  DEPOT_FACTURES,
  CARTOGRAPHIE,
  PAIEMENT
} from '../../composition-root/composition-root.module';
import {
  DepotRestaurants,
  DepotPlats,
  DepotClients,
  DepotCommandes,
  DepotFactures,
  ServiceCartographie,
  ServicePaiement
} from '@ecoeats/application';

@Module({
  controllers: [ClientController],
  providers: [
    {
      provide: ListerRestaurantsUseCase,
      useFactory: (depotRestaurants: DepotRestaurants) => new ListerRestaurantsUseCase(depotRestaurants),
      inject: [DEPOT_RESTAURANTS],
    },
    {
      provide: VoirMenuRestaurantUseCase,
      useFactory: (depotPlats: DepotPlats) => new VoirMenuRestaurantUseCase(depotPlats),
      inject: [DEPOT_PLATS],
    },
    {
      provide: AjouterAuPanierUseCase,
      useFactory: (depotPlats: DepotPlats, depotClients: DepotClients) => new AjouterAuPanierUseCase(depotPlats, depotClients),
      inject: [DEPOT_PLATS, DEPOT_CLIENTS],
    },
    {
      provide: PasserCommandeUseCase,
      useFactory: (
        depotCommandes: DepotCommandes,
        depotRestaurants: DepotRestaurants,
        depotClients: DepotClients,
        depotPlats: DepotPlats,
        cartographie: ServiceCartographie
      ) => new PasserCommandeUseCase(depotCommandes, depotRestaurants, depotClients, depotPlats, cartographie),
      inject: [DEPOT_COMMANDES, DEPOT_RESTAURANTS, DEPOT_CLIENTS, DEPOT_PLATS, CARTOGRAPHIE],
    },
    {
      provide: PayerCommandeUseCase,
      useFactory: (
        depotCommandes: DepotCommandes,
        depotFactures: DepotFactures,
        paiement: ServicePaiement
      ) => new PayerCommandeUseCase(depotCommandes, depotFactures, paiement),
      inject: [DEPOT_COMMANDES, DEPOT_FACTURES, PAIEMENT],
    },
  ],
})
export class ClientModule {}
