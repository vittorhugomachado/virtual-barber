/*
  Warnings:

  - You are about to drop the column `customerUserId` on the `password_reset_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `password_reset_tokens` table. All the data in the column will be lost.
  - Added the required column `userType` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('owner', 'barber');

-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_customerUserId_fkey";

-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_userId_fkey";

-- AlterTable
ALTER TABLE "password_reset_tokens" DROP COLUMN "customerUserId",
DROP COLUMN "userId",
ADD COLUMN     "barberId" INTEGER,
ADD COLUMN     "ownerId" INTEGER,
ADD COLUMN     "usedAt" TIMESTAMP(3),
ADD COLUMN     "userType" "UserType" NOT NULL;

-- CreateIndex
CREATE INDEX "password_reset_tokens_token_idx" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_expiresAt_idx" ON "password_reset_tokens"("expiresAt");

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owner_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "barber_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
