import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './filters/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enregistrement du filtre global pour les Erreurs Métier
  app.useGlobalFilters(new DomainExceptionFilter());
  // Préfixe global "api" pour être cohérent avec l'app Express
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`[EcoEATS - NestJS] Serveur démarré sur http://localhost:${port}`);
}
bootstrap();
