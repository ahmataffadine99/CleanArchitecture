"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantModule = void 0;
const common_1 = require("@nestjs/common");
const restaurant_controller_1 = require("./restaurant.controller");
const application_1 = require("@ecoeats/application");
const composition_root_module_1 = require("../../composition-root/composition-root.module");
let RestaurantModule = class RestaurantModule {
};
exports.RestaurantModule = RestaurantModule;
exports.RestaurantModule = RestaurantModule = __decorate([
    (0, common_1.Module)({
        controllers: [restaurant_controller_1.RestaurantController],
        providers: [
            {
                provide: application_1.AjouterPlatUseCase,
                useFactory: (depotPlats, depotRestaurants) => new application_1.AjouterPlatUseCase(depotPlats, depotRestaurants),
                inject: [composition_root_module_1.DEPOT_PLATS, composition_root_module_1.DEPOT_RESTAURANTS],
            },
            {
                provide: application_1.ModifierPlatUseCase,
                useFactory: (depotPlats) => new application_1.ModifierPlatUseCase(depotPlats),
                inject: [composition_root_module_1.DEPOT_PLATS],
            },
            {
                provide: application_1.SupprimerPlatUseCase,
                useFactory: (depotPlats) => new application_1.SupprimerPlatUseCase(depotPlats),
                inject: [composition_root_module_1.DEPOT_PLATS],
            },
            {
                provide: application_1.AccepterCommandeUseCase,
                useFactory: (depotCommandes) => new application_1.AccepterCommandeUseCase(depotCommandes),
                inject: [composition_root_module_1.DEPOT_COMMANDES],
            },
            {
                provide: application_1.RefuserCommandeUseCase,
                useFactory: (depotCommandes) => new application_1.RefuserCommandeUseCase(depotCommandes),
                inject: [composition_root_module_1.DEPOT_COMMANDES],
            },
            {
                provide: application_1.MarquerCommandePreteUseCase,
                useFactory: (depotCommandes) => new application_1.MarquerCommandePreteUseCase(depotCommandes),
                inject: [composition_root_module_1.DEPOT_COMMANDES],
            },
        ],
    })
], RestaurantModule);
//# sourceMappingURL=restaurant.module.js.map