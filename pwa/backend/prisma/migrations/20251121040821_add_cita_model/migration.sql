-- CreateTable
CREATE TABLE "Cita" (
    "id" BIGSERIAL NOT NULL,
    "pacienteId" BIGINT NOT NULL,
    "medicoId" BIGINT,
    "fechaCita" DATE NOT NULL,
    "horaCita" TIME,
    "especialidad" VARCHAR(100) NOT NULL,
    "motivo" VARCHAR(500),
    "estado" VARCHAR(50) NOT NULL DEFAULT 'PROGRAMADA',
    "notas" TEXT,
    "recordatorioEnviado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Cita_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cita_pacienteId_idx" ON "Cita"("pacienteId");

-- CreateIndex
CREATE INDEX "Cita_fechaCita_idx" ON "Cita"("fechaCita");

-- CreateIndex
CREATE INDEX "Cita_estado_idx" ON "Cita"("estado");

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
