-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "especialidad" VARCHAR(100);

-- CreateTable
CREATE TABLE "Interconsulta" (
    "id" BIGSERIAL NOT NULL,
    "pacienteId" BIGINT NOT NULL,
    "admisionId" BIGINT,
    "medicoSolicitanteId" BIGINT NOT NULL,
    "especialidadOrigen" VARCHAR(100) NOT NULL,
    "especialidadDestino" VARCHAR(100) NOT NULL,
    "medicoDestinoId" BIGINT,
    "motivoInterconsulta" TEXT NOT NULL,
    "resumenClinico" TEXT,
    "preguntaEspecifica" TEXT,
    "diagnosticoPresuntivo" TEXT,
    "prioridad" VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    "estado" VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    "respuestaInterconsulta" TEXT,
    "recomendaciones" TEXT,
    "fechaRespuesta" TIMESTAMPTZ,
    "fechaSolicitud" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaAceptacion" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Interconsulta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Interconsulta_pacienteId_idx" ON "Interconsulta"("pacienteId");

-- CreateIndex
CREATE INDEX "Interconsulta_medicoSolicitanteId_idx" ON "Interconsulta"("medicoSolicitanteId");

-- CreateIndex
CREATE INDEX "Interconsulta_medicoDestinoId_idx" ON "Interconsulta"("medicoDestinoId");

-- CreateIndex
CREATE INDEX "Interconsulta_especialidadDestino_idx" ON "Interconsulta"("especialidadDestino");

-- CreateIndex
CREATE INDEX "Interconsulta_estado_idx" ON "Interconsulta"("estado");

-- CreateIndex
CREATE INDEX "Interconsulta_prioridad_idx" ON "Interconsulta"("prioridad");

-- CreateIndex
CREATE INDEX "Interconsulta_fechaSolicitud_idx" ON "Interconsulta"("fechaSolicitud");

-- CreateIndex
CREATE INDEX "Usuario_especialidad_idx" ON "Usuario"("especialidad");

-- AddForeignKey
ALTER TABLE "Interconsulta" ADD CONSTRAINT "Interconsulta_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interconsulta" ADD CONSTRAINT "Interconsulta_admisionId_fkey" FOREIGN KEY ("admisionId") REFERENCES "Admision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interconsulta" ADD CONSTRAINT "Interconsulta_medicoSolicitanteId_fkey" FOREIGN KEY ("medicoSolicitanteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interconsulta" ADD CONSTRAINT "Interconsulta_medicoDestinoId_fkey" FOREIGN KEY ("medicoDestinoId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
