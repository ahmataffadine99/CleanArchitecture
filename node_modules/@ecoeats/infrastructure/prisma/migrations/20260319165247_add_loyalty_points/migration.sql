-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "telephone" TEXT,
    "pointsFidelite" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "proprietaireId" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatMenu" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prixCentimes" INTEGER NOT NULL,
    "allergenes" TEXT[],
    "stockJournalier" INTEGER NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PlatMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "prixPlatsCentimes" INTEGER NOT NULL,
    "fraisLivCentimes" INTEGER NOT NULL,
    "fraisServiceCentimes" INTEGER NOT NULL,
    "adresseLivraison" TEXT NOT NULL,
    "livreurId" TEXT,
    "tempsPreparation" INTEGER,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleCommande" (
    "id" TEXT NOT NULL,
    "commandeId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prixCentimes" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "ArticleCommande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" TEXT NOT NULL,
    "commandeId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "genereLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" INTEGER NOT NULL,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livreur" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'INDISPONIBLE',
    "portefeuilleCentimes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Livreur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompteUtilisateur" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasseHache" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "profilId" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompteUtilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Facture_commandeId_key" ON "Facture"("commandeId");

-- CreateIndex
CREATE UNIQUE INDEX "CompteUtilisateur_email_key" ON "CompteUtilisateur"("email");

-- AddForeignKey
ALTER TABLE "PlatMenu" ADD CONSTRAINT "PlatMenu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleCommande" ADD CONSTRAINT "ArticleCommande_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
