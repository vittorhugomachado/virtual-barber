-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('dinheiro', 'cartao', 'pix');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('agendado', 'finalizado', 'cancelado_pelo_cliente', 'cancelado_pela_barbearia');

-- CreateTable
CREATE TABLE "owner_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cnpj" TEXT,
    "cpf" TEXT NOT NULL,
    "refreshToken" TEXT,

    CONSTRAINT "owner_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barber_users" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "barberShopId" INTEGER,

    CONSTRAINT "barber_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_users" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "barberShopId" INTEGER,

    CONSTRAINT "customer_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barbershops" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "barbershopName" TEXT,
    "slug" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "address" TEXT,
    "logoUrl" TEXT,
    "bannerUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "barbershops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opening_hours" (
    "barbershopId" INTEGER NOT NULL,
    "day" "WeekDay" NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "timeRanges" JSONB,

    CONSTRAINT "opening_hours_pkey" PRIMARY KEY ("barbershopId","day")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerUserId" INTEGER,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "image" TEXT,
    "barbershopId" INTEGER NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "barberShopId" INTEGER NOT NULL,
    "customerUserId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "notes" TEXT,
    "barberUserId" INTEGER,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'agendado',
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "owner_users_email_key" ON "owner_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "barber_users_userName_key" ON "barber_users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "customer_users_phoneNumber_key" ON "customer_users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "barbershops_userId_key" ON "barbershops"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- AddForeignKey
ALTER TABLE "barber_users" ADD CONSTRAINT "barber_users_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "barbershops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_users" ADD CONSTRAINT "customer_users_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "barbershops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barbershops" ADD CONSTRAINT "barbershops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "owner_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opening_hours" ADD CONSTRAINT "opening_hours_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "barbershops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "owner_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_customerUserId_fkey" FOREIGN KEY ("customerUserId") REFERENCES "customer_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "barbershops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "fk_appointment_barbershop" FOREIGN KEY ("barberShopId") REFERENCES "barbershops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_customerUserId_fkey" FOREIGN KEY ("customerUserId") REFERENCES "customer_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_barberUserId_fkey" FOREIGN KEY ("barberUserId") REFERENCES "barber_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
