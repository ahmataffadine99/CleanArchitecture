import { Module } from '@nestjs/common';
import { CompositionRootModule } from './composition-root/composition-root.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientModule } from './modules/client/client.module';

@Module({
  imports: [
    CompositionRootModule,
    
    AuthModule,
    ClientModule,
  ],
})
export class AppModule {}
