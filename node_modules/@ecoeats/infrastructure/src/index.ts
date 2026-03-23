// Adaptateurs In-Memory (développement / tests)
export { DepotCommandesEnMemoire } from "./in-memory/DepotCommandesEnMemoire";
export { DepotRestaurantsEnMemoire } from "./in-memory/DepotRestaurantsEnMemoire";
export { DepotPlatsEnMemoire } from "./in-memory/DepotPlatsEnMemoire";
export { DepotClientsEnMemoire } from "./in-memory/DepotClientsEnMemoire";
export { DepotLivreursEnMemoire } from "./in-memory/DepotLivreursEnMemoire";
export { DepotFacturesEnMemoire } from "./in-memory/DepotFacturesEnMemoire";
export { DepotComptesEnMemoire } from "./in-memory/DepotComptesEnMemoire";

// Adaptateurs PostgreSQL - Prisma (production)
export { DepotCommandesPrisma } from "./postgresql/DepotCommandesPrisma";
export { DepotRestaurantsPrisma } from "./postgresql/DepotRestaurantsPrisma";
export { DepotPlatsPrisma } from "./postgresql/DepotPlatsPrisma";
export { DepotClientsPrisma } from "./postgresql/DepotClientsPrisma";
export { DepotLivreursPrisma } from "./postgresql/DepotLivreursPrisma";
export { DepotComptesPrisma } from "./postgresql/DepotComptesPrisma";
export { DepotAvisPrisma } from "./postgresql/DepotAvisPrisma";
export { DepotFavorisPrisma } from "./postgresql/DepotFavorisPrisma";
export { DepotTicketsPrisma } from "./postgresql/DepotTicketsPrisma";

// Services externes
export { CartographieHaversine } from "./services/CartographieHaversine";
export { PaiementSimule } from "./services/PaiementSimule";
