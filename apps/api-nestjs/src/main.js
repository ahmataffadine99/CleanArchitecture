"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const domain_exception_filter_1 = require("./filters/domain-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new domain_exception_filter_1.DomainExceptionFilter());
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`[EcoEATS - NestJS] Serveur démarré sur http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map