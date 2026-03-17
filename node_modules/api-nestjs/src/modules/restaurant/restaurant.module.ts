import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import {
  AjouterPlatUseCase,
  ModifierPlatUseCase,
  SupprimerPlatUseCase,
  AccepterCommandeUseCase,
  RefuserCommandeUseCase,
  MarquerCommandePreteUseCase,
} from '@ecoeats/application';
import {
  DEPOT_PLATS,
  DEPOT_RESTAURANTS,
  DEPOT_COMMANDES,
} from '../../composition-root/composition-root.module';
import { DepotPlats, DepotRestaurants, DepotCommandes } from '@ecoeats/application';

@Module({
  controllers: [RestaurantController],
  providers: [
    {
      provide: AjouterPlatUseCase,
      useFactory: (depotPlats: DepotPlats, depotRestaurants: DepotRestaurants) => new AjouterPlatUseCase(depotPlats, depotRestaurants),
      inject: [DEPOT_PLATS, DEPOT_RESTAURANTS],
    },
    {
      provide: ModifierPlatUseCase,
      useFactory: (depotPlats: DepotPlats) => new ModifierPlatUseCase(depotPlats),
      inject: [DEPOT_PLATS],
    },
    {
      provide: SupprimerPlatUseCase,
      useFactory: (depotPlats: DepotPlats) => new SupprimerPlatUseCase(depotPlats),
      inject: [DEPOT_PLATS],
    },
    {
      provide: AccepterCommandeUseCase,
      useFactory: (depotCommandes: DepotCommandes) => new AccepterCommandeUseCase(depotCommandes),
      inject: [DEPOT_COMMANDES],
    },
    {
      provide: RefuserCommandeUseCase,
      useFactory: (depotCommandes: DepotCommandes) => new RefuserCommandeUseCase(depotCommandes),
      inject: [DEPOT_COMMANDES],
    },
    {
      provide: MarquerCommandePreteUseCase,
      useFactory: (depotCommandes: DepotCommandes) => new MarquerCommandePreteUseCase(depotCommandes),
      inject: [DEPOT_COMMANDES],
    },
  ],
})
export class RestaurantModule {}
