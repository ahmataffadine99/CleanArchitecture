"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivreurModule = void 0;
const common_1 = require("@nestjs/common");
const livreur_controller_1 = require("./livreur.controller");
const application_1 = require("@ecoeats/application");
const composition_root_module_1 = require("../../composition-root/composition-root.module");
let LivreurModule = class LivreurModule {
};
exports.LivreurModule = LivreurModule;
exports.LivreurModule = LivreurModule = __decorate([
    (0, common_1.Module)({
        controllers: [livreur_controller_1.LivreurController],
        providers: [
            {
                provide: application_1.ChangerStatutLivreurUseCase,
                useFactory: (depotLivreurs) => new application_1.ChangerStatutLivreurUseCase(depotLivreurs),
                inject: [composition_root_module_1.DEPOT_LIVREURS],
            },
            {
                provide: application_1.AttribuerLivraisonUseCase,
                useFactory: (depotCommandes, depotLivreurs, depotRestaurants) => new application_1.AttribuerLivraisonUseCase(depotCommandes, depotLivreurs, depotRestaurants),
                inject: [composition_root_module_1.DEPOT_COMMANDES, composition_root_module_1.DEPOT_LIVREURS, composition_root_module_1.DEPOT_RESTAURANTS],
            },
            {
                provide: application_1.TerminerLivraisonUseCase,
                useFactory: (depotCommandes, depotLivreurs, depotRestaurants, cartographie) => new application_1.TerminerLivraisonUseCase(depotCommandes, depotLivreurs, depotRestaurants, cartographie),
                inject: [composition_root_module_1.DEPOT_COMMANDES, composition_root_module_1.DEPOT_LIVREURS, composition_root_module_1.DEPOT_RESTAURANTS, composition_root_module_1.CARTOGRAPHIE],
            },
        ],
    })
], LivreurModule);
//# sourceMappingURL=livreur.module.js.map