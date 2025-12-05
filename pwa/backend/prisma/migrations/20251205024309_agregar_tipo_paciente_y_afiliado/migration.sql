/*
  Warnings:

  - You are about to drop the column `region` on the `Paciente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Paciente" DROP COLUMN "region",
ADD COLUMN     "tipoPaciente" VARCHAR(50) NOT NULL DEFAULT 'PNA';

-- CreateTable
CREATE TABLE "Afiliado" (
    "id" SERIAL NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "nroCarnet" VARCHAR(100),
    "parentesco" VARCHAR(100),
    "titularNombre" VARCHAR(200),
    "titularCi" VARCHAR(50),
    "titularGrado" VARCHAR(50),
    "titularComponente" VARCHAR(100),
    "fechaAfiliacion" DATE,
    "vigente" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Afiliado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Afiliado_pacienteId_key" ON "Afiliado"("pacienteId");

-- CreateIndex
CREATE INDEX "Afiliado_titularCi_idx" ON "Afiliado"("titularCi");

-- CreateIndex
CREATE INDEX "Afiliado_nroCarnet_idx" ON "Afiliado"("nroCarnet");

-- CreateIndex
CREATE INDEX "Paciente_tipoPaciente_idx" ON "Paciente"("tipoPaciente");

-- AddForeignKey
ALTER TABLE "Afiliado" ADD CONSTRAINT "Afiliado_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
