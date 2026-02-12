/*
  Warnings:

  - You are about to drop the column `address` on the `barbershops` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BrazilianState" AS ENUM ('Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito_Federal', 'Espírito_Santo', 'Goiás', 'Maranhão', 'Mato_Grosso', 'Mato_Grosso_do_Sul', 'Minas_Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio_de_Janeiro', 'Rio_Grande_do_Norte', 'Rio_Grande_do_Sul', 'Rondônia', 'Roraima', 'Santa_Catarina', 'São_Paulo', 'Sergipe', 'Tocantins');

-- AlterTable
ALTER TABLE "barbershops" DROP COLUMN "address";

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" "BrazilianState" NOT NULL,
    "zipCode" CHAR(8) NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "barberShopId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "addresses_barberShopId_key" ON "addresses"("barberShopId");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "barbershops"("id") ON DELETE SET NULL ON UPDATE CASCADE;
