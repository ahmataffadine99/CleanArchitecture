"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const application_1 = require("@ecoeats/application");
const composition_root_module_1 = require("../../composition-root/composition-root.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [
            {
                provide: application_1.InscriptionUseCase,
                useFactory: (depotComptes, depotClients) => {
                    return new application_1.InscriptionUseCase(depotComptes, depotClients);
                },
                inject: [composition_root_module_1.DEPOT_COMPTES, composition_root_module_1.DEPOT_CLIENTS],
            },
            {
                provide: application_1.ConnexionUseCase,
                useFactory: (depotComptes) => {
                    const secret = process.env.JWT_SECRET || 'mon_super_secret_jwt_hyper_securise';
                    return new application_1.ConnexionUseCase(depotComptes, secret);
                },
                inject: [composition_root_module_1.DEPOT_COMPTES],
            },
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map