"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientModule = void 0;
const common_1 = require("@nestjs/common");
const client_controller_1 = require("./client.controller");
const application_1 = require("@ecoeats/application");
const composition_root_module_1 = require("../../composition-root/composition-root.module");
let ClientModule = class ClientModule {
};
exports.ClientModule = ClientModule;
exports.ClientModule = ClientModule = __decorate([
    (0, common_1.Module)({
        controllers: [client_controller_1.ClientController],
        providers: [
            {
                provide: application_1.ListerRestaurantsUseCase,
                useFactory: (depotRestaurants) => new application_1.ListerRestaurantsUseCase(depotRestaurants),
                inject: [composition_root_module_1.DEPOT_RESTAURANTS],
            },
            {
                provide: application_1.VoirMenuRestaurantUseCase,
                useFactory: (depotPlats) => new application_1.VoirMenuRestaurantUseCase(depotPlats),
                inject: [composition_root_module_1.DEPOT_PLATS],
            },
            {
                provide: application_1.AjouterAuPanierUseCase,
                useFactory: (depotPlats, depotClients) => new application_1.AjouterAuPanierUseCase(depotPlats, depotClients),
                inject: [composition_root_module_1.DEPOT_PLATS, composition_root_module_1.DEPOT_CLIENTS],
            },
            {
                provide: application_1.PasserCommandeUseCase,
                useFactory: (depotCommandes, depotRestaurants, depotClients, depotPlats, cartographie) => new application_1.PasserCommandeUseCase(depotCommandes, depotRestaurants, depotClients, depotPlats, cartographie),
                inject: [composition_root_module_1.DEPOT_COMMANDES, composition_root_module_1.DEPOT_RESTAURANTS, composition_root_module_1.DEPOT_CLIENTS, composition_root_module_1.DEPOT_PLATS, composition_root_module_1.CARTOGRAPHIE],
            },
            {
                provide: application_1.PayerCommandeUseCase,
                useFactory: (depotCommandes, depotFactures, paiement) => new application_1.PayerCommandeUseCase(depotCommandes, depotFactures, paiement),
                inject: [composition_root_module_1.DEPOT_COMMANDES, composition_root_module_1.DEPOT_FACTURES, composition_root_module_1.PAIEMENT],
            },
        ],
    })
], ClientModule);
//# sourceMappingURL=client.module.js.map