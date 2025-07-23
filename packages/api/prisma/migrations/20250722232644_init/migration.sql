-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ADMINISTRATIVO', 'CHOFER', 'CLIENTE');

-- CreateEnum
CREATE TYPE "TipoContratacion" AS ENUM ('EN_RELACION_DE_DEPENDENCIA', 'CONTRATADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT,
    "cuit" TEXT,
    "razonSocial" TEXT,
    "tipoContratacion" "TipoContratacion",
    "rol" "Role" NOT NULL DEFAULT 'CLIENTE',
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cuit_key" ON "User"("cuit");
