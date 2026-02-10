/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `barber_users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "barber_users_phoneNumber_key" ON "barber_users"("phoneNumber");
