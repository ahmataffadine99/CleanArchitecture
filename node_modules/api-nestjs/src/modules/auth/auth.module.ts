import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { InscriptionUseCase, ConnexionUseCase } from '@ecoeats/application';
import { DepotComptes, DepotClients, DepotRestaurants, DepotLivreurs } from '@ecoeats/application';
import { DEPOT_COMPTES, DEPOT_CLIENTS, DEPOT_RESTAURANTS, DEPOT_LIVREURS } from '../../composition-root/composition-root.module';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: InscriptionUseCase,
      useFactory: (
        depotComptes: DepotComptes, 
        depotClients: DepotClients,
        depotRestaurants: DepotRestaurants,
        depotLivreurs: DepotLivreurs
      ) => {
        const secret = process.env.JWT_SECRET || 'mon_super_secret_jwt_hyper_securise';
        return new InscriptionUseCase(depotComptes, depotClients, depotRestaurants, depotLivreurs, secret);
      },
      inject: [DEPOT_COMPTES, DEPOT_CLIENTS, DEPOT_RESTAURANTS, DEPOT_LIVREURS],
    },
    {
      provide: ConnexionUseCase,
      useFactory: (depotComptes: DepotComptes) => {
        const secret = process.env.JWT_SECRET || 'mon_super_secret_jwt_hyper_securise';
        return new ConnexionUseCase(depotComptes, secret);
      },
      inject: [DEPOT_COMPTES],
    },
  ],
})
export class AuthModule {}
