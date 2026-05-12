import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import {
  AjouterPlatUseCase,
  ModifierPlatUseCase,
  SupprimerPlatUseCase,
  AccepterCommandeUseCase,
  RefuserCommandeUseCase,
  MarquerCommandePreteUseCase,
  ProposerLivraisonUseCase,
} from '@ecoeats/application';
import {
  DEPOT_PLATS,
  DEPOT_RESTAURANTS,
  DEPOT_COMMANDES,
  DEPOT_LIVREURS,
  CARTOGRAPHIE,
} from '../../composition-root/composition-root.module';
import { DepotPlats, DepotRestaurants, DepotCommandes, DepotLivreurs, ServiceCartographie, ProposerLivraisonUseCase } from '@ecoeats/application';

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
      provide: ProposerLivraisonUseCase,
      useFactory: (
        depotCommandes: DepotCommandes,
        depotLivreurs: DepotLivreurs,
        depotRestaurants: DepotRestaurants,
        cartographie: ServiceCartographie
      ) => new ProposerLivraisonUseCase(depotCommandes, depotLivreurs, depotRestaurants, cartographie),
      inject: [DEPOT_COMMANDES, DEPOT_LIVREURS, DEPOT_RESTAURANTS, CARTOGRAPHIE],
    },
    {
      provide: AccepterCommandeUseCase,
      useFactory: (depotCommandes: DepotCommandes, proposerLivraison: ProposerLivraisonUseCase) => 
        new AccepterCommandeUseCase(depotCommandes, proposerLivraison),
      inject: [DEPOT_COMMANDES, ProposerLivraisonUseCase],
    },
    {
      provide: RefuserCommandeUseCase,
      useFactory: (depotCommandes: DepotCommandes) => new RefuserCommandeUseCase(depotCommandes),
      inject: [DEPOT_COMMANDES],
    },
    {
      provide: MarquerCommandePreteUseCase,
      useFactory: (depotCommandes: DepotCommandes, proposerLivraison: ProposerLivraisonUseCase) => 
        new MarquerCommandePreteUseCase(depotCommandes, proposerLivraison),
      inject: [DEPOT_COMMANDES, ProposerLivraisonUseCase],
    },
  ],
})
export class RestaurantModule {}
