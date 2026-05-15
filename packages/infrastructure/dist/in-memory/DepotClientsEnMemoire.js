"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotClientsEnMemoire = void 0;
const domain_1 = require("@ecoeats/domain");
class DepotClientsEnMemoire {
    store = new Map();
    async sauvegarder(client) {
        this.store.set(client.id, client);
    }
    async trouverParId(id) {
        const client = this.store.get(id);
        if (!client)
            throw new domain_1.ClientIntrouvableError(id);
        return client;
    }
}
exports.DepotClientsEnMemoire = DepotClientsEnMemoire;