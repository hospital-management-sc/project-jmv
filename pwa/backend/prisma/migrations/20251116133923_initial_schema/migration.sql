-- CreateTable
CREATE TABLE "Paciente" (
    "id" BIGSERIAL NOT NULL,
    "nroHistoria" VARCHAR(50) NOT NULL,
    "apellidosNombres" VARCHAR(200) NOT NULL,
    "ci" VARCHAR(50) NOT NULL,
    "fechaNacimiento" DATE,
    "sexo" VARCHAR(3),
    "nacionalidad" VARCHAR(100),
    "direccion" VARCHAR(300),
    "telefono" VARCHAR(50),
    "lugarNacimiento" VARCHAR(200),
    "estado" VARCHAR(100),
    "region" VARCHAR(100),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalMilitar" (
    "id" BIGSERIAL NOT NULL,
    "pacienteId" BIGINT NOT NULL,
    "grado" VARCHAR(50),
    "componente" VARCHAR(100),
    "unidad" VARCHAR(200),

    CONSTRAINT "PersonalMilitar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "ci" VARCHAR(50),
    "cargo" VARCHAR(100),
    "role" VARCHAR(50),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admision" (
    "id" BIGSERIAL NOT NULL,
    "pacienteId" BIGINT NOT NULL,
    "fechaAdmision" DATE NOT NULL,
    "horaAdmision" TIME,
    "formaIngreso" VARCHAR(20),
    "habitacion" VARCHAR(50),
    "firmaFacultativo" VARCHAR(200),
    "estadoAdmision" VARCHAR(50),
    "createdById" BIGINT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Admision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstanciaHospitalaria" (
    "id" BIGSERIAL NOT NULL,
    "admisionId" BIGINT NOT NULL,
    "fechaAlta" DATE,
    "diasHosp" INTEGER,
    "diagnosticoIngresoId" BIGINT,
    "diagnosticoEgresoId" BIGINT,
    "notas" TEXT,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "EstanciaHospitalaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnostico" (
    "id" BIGSERIAL NOT NULL,
    "codigoCie" VARCHAR(20),
    "descripcion" VARCHAR(500) NOT NULL,
    "tipo" VARCHAR(20),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encuentro" (
    "id" BIGSERIAL NOT NULL,
    "pacienteId" BIGINT NOT NULL,
    "admisionId" BIGINT,
    "tipo" VARCHAR(30) NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TIME,
    "motivoConsulta" VARCHAR(1000),
    "enfermedadActual" TEXT,
    "procedencia" VARCHAR(200),
    "nroCama" VARCHAR(50),
    "createdById" BIGINT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Encuentro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignosVitales" (
    "id" BIGSERIAL NOT NULL,
    "encuentroId" BIGINT NOT NULL,
    "taSistolica" INTEGER,
    "taDiastolica" INTEGER,
    "pulso" INTEGER,
    "temperatura" DECIMAL(4,2),
    "fr" INTEGER,
    "observaciones" VARCHAR(500),
    "registradoEn" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignosVitales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamenRegional" (
    "id" BIGSERIAL NOT NULL,
    "encuentroId" BIGINT NOT NULL,
    "piel" TEXT,
    "cabeza" TEXT,
    "cuello" TEXT,
    "torax" TEXT,
    "pulmones" TEXT,
    "corazon" TEXT,
    "abdomen" TEXT,
    "anoRecto" TEXT,
    "genitales" TEXT,

    CONSTRAINT "ExamenRegional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Antecedente" (
    "id" BIGSERIAL NOT NULL,
    "pacienteId" BIGINT NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "registradoEn" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Antecedente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImpresionDiagnostica" (
    "id" BIGSERIAL NOT NULL,
    "encuentroId" BIGINT NOT NULL,
    "codigoCie" VARCHAR(20),
    "descripcion" TEXT,
    "clase" VARCHAR(20) NOT NULL DEFAULT 'PRESUNTIVO',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImpresionDiagnostica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" BIGSERIAL NOT NULL,
    "tabla" VARCHAR(100) NOT NULL,
    "registroId" BIGINT,
    "usuarioId" BIGINT,
    "accion" VARCHAR(50) NOT NULL,
    "detalle" JSONB,
    "creadoEn" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_nroHistoria_key" ON "Paciente"("nroHistoria");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_ci_key" ON "Paciente"("ci");

-- CreateIndex
CREATE INDEX "Paciente_ci_idx" ON "Paciente"("ci");

-- CreateIndex
CREATE INDEX "Paciente_nroHistoria_idx" ON "Paciente"("nroHistoria");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalMilitar_pacienteId_key" ON "PersonalMilitar"("pacienteId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_ci_key" ON "Usuario"("ci");

-- CreateIndex
CREATE INDEX "Usuario_email_idx" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_ci_idx" ON "Usuario"("ci");

-- CreateIndex
CREATE INDEX "Admision_pacienteId_idx" ON "Admision"("pacienteId");

-- CreateIndex
CREATE INDEX "Admision_fechaAdmision_idx" ON "Admision"("fechaAdmision");

-- CreateIndex
CREATE UNIQUE INDEX "EstanciaHospitalaria_admisionId_key" ON "EstanciaHospitalaria"("admisionId");

-- CreateIndex
CREATE INDEX "Diagnostico_codigoCie_idx" ON "Diagnostico"("codigoCie");

-- CreateIndex
CREATE INDEX "Encuentro_pacienteId_fecha_idx" ON "Encuentro"("pacienteId", "fecha");

-- CreateIndex
CREATE INDEX "SignosVitales_encuentroId_idx" ON "SignosVitales"("encuentroId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamenRegional_encuentroId_key" ON "ExamenRegional"("encuentroId");

-- CreateIndex
CREATE INDEX "Antecedente_pacienteId_idx" ON "Antecedente"("pacienteId");

-- CreateIndex
CREATE INDEX "ImpresionDiagnostica_codigoCie_idx" ON "ImpresionDiagnostica"("codigoCie");

-- CreateIndex
CREATE INDEX "ImpresionDiagnostica_encuentroId_idx" ON "ImpresionDiagnostica"("encuentroId");

-- CreateIndex
CREATE INDEX "AuditLog_tabla_idx" ON "AuditLog"("tabla");

-- CreateIndex
CREATE INDEX "AuditLog_usuarioId_idx" ON "AuditLog"("usuarioId");

-- AddForeignKey
ALTER TABLE "PersonalMilitar" ADD CONSTRAINT "PersonalMilitar_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admision" ADD CONSTRAINT "Admision_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admision" ADD CONSTRAINT "Admision_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstanciaHospitalaria" ADD CONSTRAINT "EstanciaHospitalaria_admisionId_fkey" FOREIGN KEY ("admisionId") REFERENCES "Admision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstanciaHospitalaria" ADD CONSTRAINT "EstanciaHospitalaria_diagnosticoIngresoId_fkey" FOREIGN KEY ("diagnosticoIngresoId") REFERENCES "Diagnostico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstanciaHospitalaria" ADD CONSTRAINT "EstanciaHospitalaria_diagnosticoEgresoId_fkey" FOREIGN KEY ("diagnosticoEgresoId") REFERENCES "Diagnostico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encuentro" ADD CONSTRAINT "Encuentro_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encuentro" ADD CONSTRAINT "Encuentro_admisionId_fkey" FOREIGN KEY ("admisionId") REFERENCES "Admision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encuentro" ADD CONSTRAINT "Encuentro_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignosVitales" ADD CONSTRAINT "SignosVitales_encuentroId_fkey" FOREIGN KEY ("encuentroId") REFERENCES "Encuentro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamenRegional" ADD CONSTRAINT "ExamenRegional_encuentroId_fkey" FOREIGN KEY ("encuentroId") REFERENCES "Encuentro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Antecedente" ADD CONSTRAINT "Antecedente_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImpresionDiagnostica" ADD CONSTRAINT "ImpresionDiagnostica_encuentroId_fkey" FOREIGN KEY ("encuentroId") REFERENCES "Encuentro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
