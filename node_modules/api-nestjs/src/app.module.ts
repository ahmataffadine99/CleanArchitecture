import { Module } from '@nestjs/common';
import { CompositionRootModule } from './composition-root/composition-root.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientModule } from './modules/client/client.module';

@Module({
  imports: [
    // Le module CompositionRoot configure et fournit tous les adaptateurs Infrastructures (DB, etc)
    CompositionRootModule,
    
    // Modules métiers exposant les Controllers API
    AuthModule,
    ClientModule,
    // RestaurantModule, LivreurModule... (à faire ensuite)
  ],
})
export class AppModule {}
