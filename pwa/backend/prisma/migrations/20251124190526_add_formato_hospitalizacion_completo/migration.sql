/*
  Warnings:

  - You are about to drop the column `estadoAdmision` on the `Admision` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admision" DROP COLUMN "estadoAdmision",
ADD COLUMN     "cama" VARCHAR(50),
ADD COLUMN     "estado" VARCHAR(50) NOT NULL DEFAULT 'ACTIVA',
ADD COLUMN     "fechaAlta" DATE,
ADD COLUMN     "horaAlta" TIME,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "servicio" VARCHAR(100),
ADD COLUMN     "tipo" VARCHAR(50) NOT NULL DEFAULT 'HOSPITALIZACION',
ADD COLUMN     "tipoAlta" VARCHAR(50);

-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "estadoRegistro" VARCHAR(50) NOT NULL DEFAULT 'PERMANENTE';

-- CreateTable
CREATE TABLE "FormatoEmergencia" (
    "id" BIGSERIAL NOT NULL,
    "admisionId" BIGINT NOT NULL,
    "motivoConsulta" TEXT,
    "enfermedadActual" TEXT,
    "procedencia" VARCHAR(200),
    "taSistolica" INTEGER,
    "taDiastolica" INTEGER,
    "fc" INTEGER,
    "fr" INTEGER,
    "temperatura" DECIMAL(4,2),
    "spo2" INTEGER,
    "impresionDx" TEXT,
    "indicaciones" TEXT,
    "requiereHospitalizacion" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "FormatoEmergencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormatoHospitalizacion" (
    "id" BIGSERIAL NOT NULL,
    "admisionId" BIGINT NOT NULL,
    "pacienteId" BIGINT NOT NULL,
    "fechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimaActualizacion" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "FormatoHospitalizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignosVitalesHosp" (
    "id" BIGSERIAL NOT NULL,
    "formatoHospId" BIGINT NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TIME NOT NULL,
    "taSistolica" INTEGER,
    "taDiastolica" INTEGER,
    "tam" DECIMAL(5,2),
    "fc" INTEGER,
    "fr" INTEGER,
    "temperatura" DECIMAL(4,2),
    "spo2" INTEGER,
    "observacion" TEXT,
    "registradoPor" BIGINT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignosVitalesHosp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laboratorio" (
    "id" BIGSERIAL NOT NULL,
    "formatoHospId" BIGINT NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TIME,
    "hgb" DECIMAL(5,2),
    "hct" DECIMAL(5,2),
    "vcm" DECIMAL(5,2),
    "chcm" DECIMAL(5,2),
    "leucocitos" DECIMAL(10,2),
    "neutrofilos" DECIMAL(5,2),
    "linfocitos" DECIMAL(5,2),
    "eosinofilos" DECIMAL(5,2),
    "plaquetas" DECIMAL(10,2),
    "pt" DECIMAL(5,2),
    "ptt" DECIMAL(5,2),
    "inr" DECIMAL(4,2),
    "fibrinogeno" DECIMAL(7,2),
    "vsg" DECIMAL(5,2),
    "pcr" DECIMAL(7,2),
    "glicemia" DECIMAL(7,2),
    "urea" DECIMAL(7,2),
    "creatinina" DECIMAL(5,2),
    "amilasa" DECIMAL(7,2),
    "lipasa" DECIMAL(7,2),
    "tgo" DECIMAL(7,2),
    "tgp" DECIMAL(7,2),
    "troponina" DECIMAL(7,4),
    "fosfatasa_alcalina" DECIMAL(7,2),
    "bilirrubina_total" DECIMAL(5,2),
    "bilirrubina_directa" DECIMAL(5,2),
    "bilirrubina_indirecta" DECIMAL(5,2),
    "acido_urico" DECIMAL(5,2),
    "proteinas_totales" DECIMAL(5,2),
    "albumina" DECIMAL(5,2),
    "globulina" DECIMAL(5,2),
    "ldh" DECIMAL(7,2),
    "colesterol" DECIMAL(7,2),
    "trigliceridos" DECIMAL(7,2),
    "sodio" DECIMAL(5,2),
    "potasio" DECIMAL(4,2),
    "cloro" DECIMAL(5,2),
    "ferritina" DECIMAL(7,2),
    "dimero_d" DECIMAL(7,2),
    "ck" DECIMAL(7,2),
    "ckmb" DECIMAL(7,2),
    "observaciones" TEXT,
    "registradoPor" BIGINT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Laboratorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstudioEspecial" (
    "id" BIGSERIAL NOT NULL,
    "formatoHospId" BIGINT NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TIME,
    "tipoEstudio" VARCHAR(100) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "resultado" TEXT,
    "archivoUrl" VARCHAR(500),
    "registradoPor" BIGINT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EstudioEspecial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Electrocardiograma" (
    "id" BIGSERIAL NOT NULL,
    "formatoHospId" BIGINT NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TIME,
    "interpretacion" TEXT,
    "ritmo" VARCHAR(100),
    "frecuencia" INTEGER,
    "hallazgos" TEXT,
    "archivoUrl" VARCHAR(500),
    "registradoPor" BIGINT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Electrocardiograma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AntecedentesDetallados" (
    "id" BIGSERIAL NOT NULL,
    "formatoHospId" BIGINT NOT NULL,
    "patologiaBase" TEXT,
    "alergiaMedicamentos" TEXT,
    "antecedentesQx" TEXT,
    "transfusionesSanguineas" TEXT,
    "traumatismos" TEXT,
    "hospitalizacionesRecientes" TEXT,
    "madre" TEXT,
    "padre" TEXT,
    "hermanos" TEXT,
    "hermanasCantidad" INTEGER,
    "hermanosCantidad" INTEGER,
    "hijasCantidad" INTEGER,
    "hijosCantidad" INTEGER,
    "cafeinicos" TEXT,
    "tabaquicos" TEXT,
    "ipa" DECIMAL(5,2),
    "alcoholicos" TEXT,
    "drogas" TEXT,
    "adiccionMedicamentos" TEXT,
    "viajesRecientes" TEXT,
    "residenciaZona" VARCHAR(200),
    "viviendaTipo" VARCHAR(100),
    "viviendaSalas" INTEGER,
    "viviendaCocina" BOOLEAN,
    "viviendaComedor" BOOLEAN,
    "viviendaBanos" INTEGER,
    "viviendaCuartos" INTEGER,
    "viviendaPersonasCant" INTEGER,
    "servicioElectricidad" BOOLEAN,
    "servicioAguasBlancas" BOOLEAN,
    "servicioAguasResiduales" BOOLEAN,
    "servicioGasDomestico" BOOLEAN,
    "servicioAseoUrbano" BOOLEAN,
    "contactoAnimales" TEXT,
    "vectores" TEXT,
    "contactoTB" BOOLEAN,
    "privadosLibertad" BOOLEAN,
    "pacienteCovid" BOOLEAN,
    "tosedoresCronicos" BOOLEAN,
    "parejasSexuales" VARCHAR(100),
    "otrosEpidemiologicos" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "AntecedentesDetallados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamenFuncional" (
    "id" BIGSERIAL NOT NULL,
    "formatoHospId" BIGINT NOT NULL,
    "general" TEXT,
    "piel" TEXT,
    "cabeza" TEXT,
    "ojos" TEXT,
    "oidos" TEXT,
    "nariz" TEXT,
    "boca" TEXT,
    "garganta" TEXT,
    "respiratorio" TEXT,
    "cardiovascular" TEXT,
    "genitourinario" TEXT,
    "gastrointestinal" TEXT,
    "nervioso" TEXT,
    "oma" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ExamenFuncional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamenFisicoCompleto" (
    "id" BIGSERIAL NOT NULL,
    "formatoHospId" BIGINT NOT NULL,
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora" TIME,
    "taSistolica" INTEGER,
    "taDiastolica" INTEGER,
    "fc" INTEGER,
    "fr" INTEGER,
    "temperatura" DECIMAL(4,2),
    "spo2" INTEGER,
    "peso" DECIMAL(5,2),
    "talla" DECIMAL(5,2),
    "piel" TEXT,
    "cabeza" TEXT,
    "ojos" TEXT,
    "oidos" TEXT,
    "boca" TEXT,
    "cuello" TEXT,
    "cp" TEXT,
    "abdomen" TEXT,
    "genitales" TEXT,
    "extremidades" TEXT,
    "neurologico" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ExamenFisicoCompleto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumenIngreso" (
    "id" BIGSERIAL NOT NULL,
    "formatoHospId" BIGINT NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TIME,
    "motivoConsulta" TEXT,
    "enfermedadActual" TEXT,
    "antecedentesResumen" TEXT,
    "examenFisicoResumen" TEXT,
    "impresionDxInicial" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ResumenIngreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenMedica" (
    "id" BIGSERIAL NOT NULL,
    "formatoHospId" BIGINT NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TIME NOT NULL,
    "tipoOrden" VARCHAR(50) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "indicaciones" TEXT,
    "estado" VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
    "fechaCumplimiento" TIMESTAMP(3),
    "archivoUrl" VARCHAR(500),
    "ordenadoPor" BIGINT,
    "cumplidaPor" BIGINT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "OrdenMedica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvolucionMedica" (
    "id" BIGSERIAL NOT NULL,
    "formatoHospId" BIGINT NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TIME NOT NULL,
    "cama" VARCHAR(50),
    "diasHospitalizacion" INTEGER,
    "impresionDx" TEXT,
    "subjetivo" TEXT,
    "objetivo" TEXT,
    "taSistolica" INTEGER,
    "taDiastolica" INTEGER,
    "fc" INTEGER,
    "fr" INTEGER,
    "spo2" INTEGER,
    "temperatura" DECIMAL(4,2),
    "piel" TEXT,
    "cp" TEXT,
    "abdomen" TEXT,
    "extremidades" TEXT,
    "neurologico" TEXT,
    "notas" TEXT,
    "evolucionadoPor" BIGINT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvolucionMedica_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormatoEmergencia_admisionId_key" ON "FormatoEmergencia"("admisionId");

-- CreateIndex
CREATE INDEX "FormatoEmergencia_admisionId_idx" ON "FormatoEmergencia"("admisionId");

-- CreateIndex
CREATE UNIQUE INDEX "FormatoHospitalizacion_admisionId_key" ON "FormatoHospitalizacion"("admisionId");

-- CreateIndex
CREATE INDEX "FormatoHospitalizacion_admisionId_idx" ON "FormatoHospitalizacion"("admisionId");

-- CreateIndex
CREATE INDEX "FormatoHospitalizacion_pacienteId_idx" ON "FormatoHospitalizacion"("pacienteId");

-- CreateIndex
CREATE INDEX "SignosVitalesHosp_formatoHospId_idx" ON "SignosVitalesHosp"("formatoHospId");

-- CreateIndex
CREATE INDEX "SignosVitalesHosp_fecha_idx" ON "SignosVitalesHosp"("fecha");

-- CreateIndex
CREATE INDEX "Laboratorio_formatoHospId_idx" ON "Laboratorio"("formatoHospId");

-- CreateIndex
CREATE INDEX "Laboratorio_fecha_idx" ON "Laboratorio"("fecha");

-- CreateIndex
CREATE INDEX "EstudioEspecial_formatoHospId_idx" ON "EstudioEspecial"("formatoHospId");

-- CreateIndex
CREATE INDEX "EstudioEspecial_fecha_idx" ON "EstudioEspecial"("fecha");

-- CreateIndex
CREATE INDEX "EstudioEspecial_tipoEstudio_idx" ON "EstudioEspecial"("tipoEstudio");

-- CreateIndex
CREATE INDEX "Electrocardiograma_formatoHospId_idx" ON "Electrocardiograma"("formatoHospId");

-- CreateIndex
CREATE INDEX "Electrocardiograma_fecha_idx" ON "Electrocardiograma"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "AntecedentesDetallados_formatoHospId_key" ON "AntecedentesDetallados"("formatoHospId");

-- CreateIndex
CREATE INDEX "AntecedentesDetallados_formatoHospId_idx" ON "AntecedentesDetallados"("formatoHospId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamenFuncional_formatoHospId_key" ON "ExamenFuncional"("formatoHospId");

-- CreateIndex
CREATE INDEX "ExamenFuncional_formatoHospId_idx" ON "ExamenFuncional"("formatoHospId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamenFisicoCompleto_formatoHospId_key" ON "ExamenFisicoCompleto"("formatoHospId");

-- CreateIndex
CREATE INDEX "ExamenFisicoCompleto_formatoHospId_idx" ON "ExamenFisicoCompleto"("formatoHospId");

-- CreateIndex
CREATE UNIQUE INDEX "ResumenIngreso_formatoHospId_key" ON "ResumenIngreso"("formatoHospId");

-- CreateIndex
CREATE INDEX "ResumenIngreso_formatoHospId_idx" ON "ResumenIngreso"("formatoHospId");

-- CreateIndex
CREATE INDEX "OrdenMedica_formatoHospId_idx" ON "OrdenMedica"("formatoHospId");

-- CreateIndex
CREATE INDEX "OrdenMedica_fecha_idx" ON "OrdenMedica"("fecha");

-- CreateIndex
CREATE INDEX "OrdenMedica_estado_idx" ON "OrdenMedica"("estado");

-- CreateIndex
CREATE INDEX "OrdenMedica_tipoOrden_idx" ON "OrdenMedica"("tipoOrden");

-- CreateIndex
CREATE INDEX "EvolucionMedica_formatoHospId_idx" ON "EvolucionMedica"("formatoHospId");

-- CreateIndex
CREATE INDEX "EvolucionMedica_fecha_idx" ON "EvolucionMedica"("fecha");

-- CreateIndex
CREATE INDEX "Admision_tipo_idx" ON "Admision"("tipo");

-- CreateIndex
CREATE INDEX "Admision_estado_idx" ON "Admision"("estado");

-- CreateIndex
CREATE INDEX "Admision_servicio_idx" ON "Admision"("servicio");

-- CreateIndex
CREATE INDEX "Paciente_estadoRegistro_idx" ON "Paciente"("estadoRegistro");

-- AddForeignKey
ALTER TABLE "FormatoEmergencia" ADD CONSTRAINT "FormatoEmergencia_admisionId_fkey" FOREIGN KEY ("admisionId") REFERENCES "Admision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormatoHospitalizacion" ADD CONSTRAINT "FormatoHospitalizacion_admisionId_fkey" FOREIGN KEY ("admisionId") REFERENCES "Admision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormatoHospitalizacion" ADD CONSTRAINT "FormatoHospitalizacion_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignosVitalesHosp" ADD CONSTRAINT "SignosVitalesHosp_formatoHospId_fkey" FOREIGN KEY ("formatoHospId") REFERENCES "FormatoHospitalizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laboratorio" ADD CONSTRAINT "Laboratorio_formatoHospId_fkey" FOREIGN KEY ("formatoHospId") REFERENCES "FormatoHospitalizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laboratorio" ADD CONSTRAINT "Laboratorio_registradoPor_fkey" FOREIGN KEY ("registradoPor") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstudioEspecial" ADD CONSTRAINT "EstudioEspecial_formatoHospId_fkey" FOREIGN KEY ("formatoHospId") REFERENCES "FormatoHospitalizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstudioEspecial" ADD CONSTRAINT "EstudioEspecial_registradoPor_fkey" FOREIGN KEY ("registradoPor") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Electrocardiograma" ADD CONSTRAINT "Electrocardiograma_formatoHospId_fkey" FOREIGN KEY ("formatoHospId") REFERENCES "FormatoHospitalizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Electrocardiograma" ADD CONSTRAINT "Electrocardiograma_registradoPor_fkey" FOREIGN KEY ("registradoPor") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AntecedentesDetallados" ADD CONSTRAINT "AntecedentesDetallados_formatoHospId_fkey" FOREIGN KEY ("formatoHospId") REFERENCES "FormatoHospitalizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamenFuncional" ADD CONSTRAINT "ExamenFuncional_formatoHospId_fkey" FOREIGN KEY ("formatoHospId") REFERENCES "FormatoHospitalizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamenFisicoCompleto" ADD CONSTRAINT "ExamenFisicoCompleto_formatoHospId_fkey" FOREIGN KEY ("formatoHospId") REFERENCES "FormatoHospitalizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumenIngreso" ADD CONSTRAINT "ResumenIngreso_formatoHospId_fkey" FOREIGN KEY ("formatoHospId") REFERENCES "FormatoHospitalizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenMedica" ADD CONSTRAINT "OrdenMedica_formatoHospId_fkey" FOREIGN KEY ("formatoHospId") REFERENCES "FormatoHospitalizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenMedica" ADD CONSTRAINT "OrdenMedica_ordenadoPor_fkey" FOREIGN KEY ("ordenadoPor") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenMedica" ADD CONSTRAINT "OrdenMedica_cumplidaPor_fkey" FOREIGN KEY ("cumplidaPor") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvolucionMedica" ADD CONSTRAINT "EvolucionMedica_formatoHospId_fkey" FOREIGN KEY ("formatoHospId") REFERENCES "FormatoHospitalizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvolucionMedica" ADD CONSTRAINT "EvolucionMedica_evolucionadoPor_fkey" FOREIGN KEY ("evolucionadoPor") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
