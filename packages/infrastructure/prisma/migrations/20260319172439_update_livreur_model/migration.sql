-- AlterTable
ALTER TABLE "Livreur" ADD COLUMN     "commandesEnCoursIds" TEXT[],
ADD COLUMN     "estExpert" BOOLEAN NOT NULL DEFAULT false;
