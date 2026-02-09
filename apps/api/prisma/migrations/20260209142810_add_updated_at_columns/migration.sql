/*
  Warnings:

  - The `phoneNumber` column on the `barbershops` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `cnpj` on the `owner_users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(14)`.
  - You are about to alter the column `cpf` on the `owner_users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(11)`.
  - A unique constraint covering the columns `[phoneNumber]` on the table `barbershops` will be added. If there are existing duplicate values, this will fail.
  - Made the column `barberShopId` on table `barber_users` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `barbershops` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `phoneNumber` on the `customer_users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `owner_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "barber_users" DROP CONSTRAINT "barber_users_barberShopId_fkey";

-- AlterTable
ALTER TABLE "barber_users" ALTER COLUMN "barberShopId" SET NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "phoneNumber" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "barbershops" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "phoneNumber",
ADD COLUMN     "phoneNumber" BIGINT;

-- AlterTable
ALTER TABLE "customer_users" DROP COLUMN "phoneNumber",
ADD COLUMN     "phoneNumber" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "owner_users" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "cnpj" SET DATA TYPE CHAR(14),
ALTER COLUMN "cpf" DROP NOT NULL,
ALTER COLUMN "cpf" SET DATA TYPE CHAR(11);

-- CreateIndex
CREATE UNIQUE INDEX "barbershops_phoneNumber_key" ON "barbershops"("phoneNumber");

-- CreateIndex
CREATE INDEX "barbershops_isActive_idx" ON "barbershops"("isActive");

-- CreateIndex
CREATE INDEX "barbershops_createdAt_idx" ON "barbershops"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "customer_users_phoneNumber_key" ON "customer_users"("phoneNumber");

-- CreateIndex
CREATE INDEX "owner_users_cpf_idx" ON "owner_users"("cpf");

-- CreateIndex
CREATE INDEX "owner_users_cnpj_idx" ON "owner_users"("cnpj");

-- CreateIndex
CREATE INDEX "owner_users_createdAt_idx" ON "owner_users"("createdAt");

-- AddForeignKey
ALTER TABLE "barber_users" ADD CONSTRAINT "barber_users_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "barbershops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
