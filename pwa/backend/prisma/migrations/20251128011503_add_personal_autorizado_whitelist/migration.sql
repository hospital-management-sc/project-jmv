-- CreateTable
CREATE TABLE "PersonalAutorizado" (
    "id" BIGSERIAL NOT NULL,
    "ci" VARCHAR(50) NOT NULL,
    "nombreCompleto" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200),
    "rolAutorizado" VARCHAR(50) NOT NULL,
    "departamento" VARCHAR(100),
    "cargo" VARCHAR(100),
    "estado" VARCHAR(50) NOT NULL DEFAULT 'ACTIVO',
    "fechaIngreso" DATE NOT NULL,
    "fechaVencimiento" DATE,
    "motivoBaja" TEXT,
    "autorizadoPor" VARCHAR(200),
    "registrado" BOOLEAN NOT NULL DEFAULT false,
    "fechaRegistro" TIMESTAMPTZ,
    "usuarioId" BIGINT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "PersonalAutorizado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalAutorizado_ci_key" ON "PersonalAutorizado"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalAutorizado_usuarioId_key" ON "PersonalAutorizado"("usuarioId");

-- CreateIndex
CREATE INDEX "PersonalAutorizado_ci_idx" ON "PersonalAutorizado"("ci");

-- CreateIndex
CREATE INDEX "PersonalAutorizado_estado_idx" ON "PersonalAutorizado"("estado");

-- CreateIndex
CREATE INDEX "PersonalAutorizado_rolAutorizado_idx" ON "PersonalAutorizado"("rolAutorizado");

-- CreateIndex
CREATE INDEX "PersonalAutorizado_registrado_idx" ON "PersonalAutorizado"("registrado");

-- AddForeignKey
ALTER TABLE "PersonalAutorizado" ADD CONSTRAINT "PersonalAutorizado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
