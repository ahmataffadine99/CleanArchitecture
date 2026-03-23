-- AlterTable
ALTER TABLE "CompteUtilisateur" ADD COLUMN     "estActif" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Livreur" ADD COLUMN     "currentRestaurantId" TEXT;

-- AlterTable
ALTER TABLE "PlatMenu" ADD COLUMN     "categorie" TEXT NOT NULL DEFAULT 'PLAT';

-- CreateTable
CREATE TABLE "FavoriRestaurant" (
    "clientId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "FavoriRestaurant_pkey" PRIMARY KEY ("clientId","restaurantId")
);

-- CreateTable
CREATE TABLE "FavoriPlat" (
    "clientId" TEXT NOT NULL,
    "platId" TEXT NOT NULL,

    CONSTRAINT "FavoriPlat_pkey" PRIMARY KEY ("clientId","platId")
);

-- CreateTable
CREATE TABLE "AvisLivreur" (
    "id" TEXT NOT NULL,
    "commandeId" TEXT NOT NULL,
    "livreurId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvisLivreur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketSupport" (
    "id" TEXT NOT NULL,
    "auteurId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'OUVERT',
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketSupport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageTicket" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "auteurId" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "estAdmin" BOOLEAN NOT NULL DEFAULT false,
    "envoyeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvisLivreur_commandeId_key" ON "AvisLivreur"("commandeId");

-- AddForeignKey
ALTER TABLE "MessageTicket" ADD CONSTRAINT "MessageTicket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "TicketSupport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
