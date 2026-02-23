-- AlterTable: Agregar especialidad a PersonalAutorizado
ALTER TABLE "PersonalAutorizado" ADD COLUMN "especialidad" VARCHAR(100);

-- CreateTable: HorarioMedico para gestión de disponibilidad
CREATE TABLE "HorarioMedico" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "especialidad" VARCHAR(100) NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "horaInicio" VARCHAR(8) NOT NULL,
    "horaFin" VARCHAR(8) NOT NULL,
    "capacidadPorDia" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "HorarioMedico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HorarioMedico_usuarioId_idx" ON "HorarioMedico"("usuarioId");

-- CreateIndex
CREATE INDEX "HorarioMedico_especialidad_idx" ON "HorarioMedico"("especialidad");

-- CreateIndex
CREATE INDEX "HorarioMedico_diaSemana_idx" ON "HorarioMedico"("diaSemana");

-- CreateIndex
CREATE UNIQUE INDEX "HorarioMedico_usuarioId_especialidad_diaSemana_key" ON "HorarioMedico"("usuarioId", "especialidad", "diaSemana");

-- AddForeignKey
ALTER TABLE "HorarioMedico" ADD CONSTRAINT "HorarioMedico_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

