import { Module } from '@nestjs/common';
import { LivreurController } from './livreur.controller';
import {
  ChangerStatutLivreurUseCase,
  AttribuerLivraisonUseCase,
  TerminerLivraisonUseCase,
} from '@ecoeats/application';
import {
  DEPOT_LIVREURS,
  DEPOT_COMMANDES,
  DEPOT_RESTAURANTS,
  CARTOGRAPHIE,
} from '../../composition-root/composition-root.module';
import { DepotLivreurs, DepotCommandes, DepotRestaurants, ServiceCartographie } from '@ecoeats/application';

@Module({
  controllers: [LivreurController],
  providers: [
    {
      provide: ChangerStatutLivreurUseCase,
      useFactory: (
        depotLivreurs: DepotLivreurs,
        depotCommandes: DepotCommandes,
        depotRestaurants: DepotRestaurants,
        cartographie: ServiceCartographie
      ) => new ChangerStatutLivreurUseCase(depotLivreurs, depotCommandes, depotRestaurants, cartographie),
      inject: [DEPOT_LIVREURS, DEPOT_COMMANDES, DEPOT_RESTAURANTS, CARTOGRAPHIE],
    },
    {
      provide: AttribuerLivraisonUseCase,
      useFactory: (
        depotCommandes: DepotCommandes,
        depotLivreurs: DepotLivreurs,
        depotRestaurants: DepotRestaurants
      ) => new AttribuerLivraisonUseCase(depotCommandes, depotLivreurs, depotRestaurants),
      inject: [DEPOT_COMMANDES, DEPOT_LIVREURS, DEPOT_RESTAURANTS],
    },
    {
      provide: TerminerLivraisonUseCase,
      useFactory: (
        depotCommandes: DepotCommandes,
        depotLivreurs: DepotLivreurs,
        depotRestaurants: DepotRestaurants,
        cartographie: ServiceCartographie
      ) => new TerminerLivraisonUseCase(depotCommandes, depotLivreurs, depotRestaurants, cartographie),
      inject: [DEPOT_COMMANDES, DEPOT_LIVREURS, DEPOT_RESTAURANTS, CARTOGRAPHIE],
    },
  ],
})
export class LivreurModule {}
