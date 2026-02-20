/*
  Warnings:

  - The primary key for the `Admision` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Admision` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `pacienteId` on the `Admision` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `createdById` on the `Admision` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Antecedente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Antecedente` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `pacienteId` on the `Antecedente` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `AntecedentesDetallados` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `AntecedentesDetallados` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `formatoHospId` on the `AntecedentesDetallados` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `AuditLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `AuditLog` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `registroId` on the `AuditLog` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `usuarioId` on the `AuditLog` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Cita` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Cita` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `pacienteId` on the `Cita` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `medicoId` on the `Cita` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Diagnostico` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Diagnostico` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Electrocardiograma` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Electrocardiograma` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `formatoHospId` on the `Electrocardiograma` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `registradoPor` on the `Electrocardiograma` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Encuentro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Encuentro` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `pacienteId` on the `Encuentro` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `admisionId` on the `Encuentro` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `createdById` on the `Encuentro` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `EstanciaHospitalaria` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `EstanciaHospitalaria` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `admisionId` on the `EstanciaHospitalaria` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `diagnosticoIngresoId` on the `EstanciaHospitalaria` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `diagnosticoEgresoId` on the `EstanciaHospitalaria` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `EstudioEspecial` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `EstudioEspecial` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `formatoHospId` on the `EstudioEspecial` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `registradoPor` on the `EstudioEspecial` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `EvolucionMedica` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `EvolucionMedica` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `formatoHospId` on the `EvolucionMedica` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `evolucionadoPor` on the `EvolucionMedica` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `ExamenFisicoCompleto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `ExamenFisicoCompleto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `formatoHospId` on the `ExamenFisicoCompleto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `ExamenFuncional` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `ExamenFuncional` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `formatoHospId` on the `ExamenFuncional` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `ExamenRegional` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `ExamenRegional` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `encuentroId` on the `ExamenRegional` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `FormatoEmergencia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `FormatoEmergencia` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `admisionId` on the `FormatoEmergencia` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `FormatoHospitalizacion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `FormatoHospitalizacion` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `admisionId` on the `FormatoHospitalizacion` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `pacienteId` on the `FormatoHospitalizacion` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `ImpresionDiagnostica` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `ImpresionDiagnostica` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `encuentroId` on the `ImpresionDiagnostica` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Interconsulta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Interconsulta` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `pacienteId` on the `Interconsulta` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `admisionId` on the `Interconsulta` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `medicoSolicitanteId` on the `Interconsulta` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `medicoDestinoId` on the `Interconsulta` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Laboratorio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Laboratorio` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `formatoHospId` on the `Laboratorio` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `registradoPor` on the `Laboratorio` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `OrdenMedica` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `OrdenMedica` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `formatoHospId` on the `OrdenMedica` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `ordenadoPor` on the `OrdenMedica` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `cumplidaPor` on the `OrdenMedica` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Paciente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Paciente` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `PersonalAutorizado` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `PersonalAutorizado` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `usuarioId` on the `PersonalAutorizado` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `PersonalMilitar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `PersonalMilitar` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `pacienteId` on the `PersonalMilitar` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `ResumenIngreso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `ResumenIngreso` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `formatoHospId` on the `ResumenIngreso` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `SignosVitales` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `SignosVitales` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `encuentroId` on the `SignosVitales` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `SignosVitalesHosp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `SignosVitalesHosp` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `formatoHospId` on the `SignosVitalesHosp` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `registradoPor` on the `SignosVitalesHosp` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "Admision" DROP CONSTRAINT "Admision_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Admision" DROP CONSTRAINT "Admision_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "Antecedente" DROP CONSTRAINT "Antecedente_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "AntecedentesDetallados" DROP CONSTRAINT "AntecedentesDetallados_formatoHospId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Cita" DROP CONSTRAINT "Cita_medicoId_fkey";

-- DropForeignKey
ALTER TABLE "Cita" DROP CONSTRAINT "Cita_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "Electrocardiograma" DROP CONSTRAINT "Electrocardiograma_formatoHospId_fkey";

-- DropForeignKey
ALTER TABLE "Electrocardiograma" DROP CONSTRAINT "Electrocardiograma_registradoPor_fkey";

-- DropForeignKey
ALTER TABLE "Encuentro" DROP CONSTRAINT "Encuentro_admisionId_fkey";

-- DropForeignKey
ALTER TABLE "Encuentro" DROP CONSTRAINT "Encuentro_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Encuentro" DROP CONSTRAINT "Encuentro_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "EstanciaHospitalaria" DROP CONSTRAINT "EstanciaHospitalaria_admisionId_fkey";

-- DropForeignKey
ALTER TABLE "EstanciaHospitalaria" DROP CONSTRAINT "EstanciaHospitalaria_diagnosticoEgresoId_fkey";

-- DropForeignKey
ALTER TABLE "EstanciaHospitalaria" DROP CONSTRAINT "EstanciaHospitalaria_diagnosticoIngresoId_fkey";

-- DropForeignKey
ALTER TABLE "EstudioEspecial" DROP CONSTRAINT "EstudioEspecial_formatoHospId_fkey";

-- DropForeignKey
ALTER TABLE "EstudioEspecial" DROP CONSTRAINT "EstudioEspecial_registradoPor_fkey";

-- DropForeignKey
ALTER TABLE "EvolucionMedica" DROP CONSTRAINT "EvolucionMedica_evolucionadoPor_fkey";

-- DropForeignKey
ALTER TABLE "EvolucionMedica" DROP CONSTRAINT "EvolucionMedica_formatoHospId_fkey";

-- DropForeignKey
ALTER TABLE "ExamenFisicoCompleto" DROP CONSTRAINT "ExamenFisicoCompleto_formatoHospId_fkey";

-- DropForeignKey
ALTER TABLE "ExamenFuncional" DROP CONSTRAINT "ExamenFuncional_formatoHospId_fkey";

-- DropForeignKey
ALTER TABLE "ExamenRegional" DROP CONSTRAINT "ExamenRegional_encuentroId_fkey";

-- DropForeignKey
ALTER TABLE "FormatoEmergencia" DROP CONSTRAINT "FormatoEmergencia_admisionId_fkey";

-- DropForeignKey
ALTER TABLE "FormatoHospitalizacion" DROP CONSTRAINT "FormatoHospitalizacion_admisionId_fkey";

-- DropForeignKey
ALTER TABLE "FormatoHospitalizacion" DROP CONSTRAINT "FormatoHospitalizacion_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "ImpresionDiagnostica" DROP CONSTRAINT "ImpresionDiagnostica_encuentroId_fkey";

-- DropForeignKey
ALTER TABLE "Interconsulta" DROP CONSTRAINT "Interconsulta_admisionId_fkey";

-- DropForeignKey
ALTER TABLE "Interconsulta" DROP CONSTRAINT "Interconsulta_medicoDestinoId_fkey";

-- DropForeignKey
ALTER TABLE "Interconsulta" DROP CONSTRAINT "Interconsulta_medicoSolicitanteId_fkey";

-- DropForeignKey
ALTER TABLE "Interconsulta" DROP CONSTRAINT "Interconsulta_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "Laboratorio" DROP CONSTRAINT "Laboratorio_formatoHospId_fkey";

-- DropForeignKey
ALTER TABLE "Laboratorio" DROP CONSTRAINT "Laboratorio_registradoPor_fkey";

-- DropForeignKey
ALTER TABLE "OrdenMedica" DROP CONSTRAINT "OrdenMedica_cumplidaPor_fkey";

-- DropForeignKey
ALTER TABLE "OrdenMedica" DROP CONSTRAINT "OrdenMedica_formatoHospId_fkey";

-- DropForeignKey
ALTER TABLE "OrdenMedica" DROP CONSTRAINT "OrdenMedica_ordenadoPor_fkey";

-- DropForeignKey
ALTER TABLE "PersonalAutorizado" DROP CONSTRAINT "PersonalAutorizado_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "PersonalMilitar" DROP CONSTRAINT "PersonalMilitar_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "ResumenIngreso" DROP CONSTRAINT "ResumenIngreso_formatoHospId_fkey";

-- DropForeignKey
ALTER TABLE "SignosVitales" DROP CONSTRAINT "SignosVitales_encuentroId_fkey";

-- DropForeignKey
ALTER TABLE "SignosVitalesHosp" DROP CONSTRAINT "SignosVitalesHosp_formatoHospId_fkey";

-- AlterTable
ALTER TABLE "Admision" DROP CONSTRAINT "Admision_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "pacienteId" SET DATA TYPE INTEGER,
ALTER COLUMN "createdById" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Admision_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Antecedente" DROP CONSTRAINT "Antecedente_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "pacienteId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Antecedente_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AntecedentesDetallados" DROP CONSTRAINT "AntecedentesDetallados_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "formatoHospId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "AntecedentesDetallados_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "registroId" SET DATA TYPE INTEGER,
ALTER COLUMN "usuarioId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Cita" DROP CONSTRAINT "Cita_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "pacienteId" SET DATA TYPE INTEGER,
ALTER COLUMN "medicoId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Cita_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Diagnostico" DROP CONSTRAINT "Diagnostico_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Diagnostico_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Electrocardiograma" DROP CONSTRAINT "Electrocardiograma_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "formatoHospId" SET DATA TYPE INTEGER,
ALTER COLUMN "registradoPor" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Electrocardiograma_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Encuentro" DROP CONSTRAINT "Encuentro_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "pacienteId" SET DATA TYPE INTEGER,
ALTER COLUMN "admisionId" SET DATA TYPE INTEGER,
ALTER COLUMN "createdById" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Encuentro_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "EstanciaHospitalaria" DROP CONSTRAINT "EstanciaHospitalaria_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "admisionId" SET DATA TYPE INTEGER,
ALTER COLUMN "diagnosticoIngresoId" SET DATA TYPE INTEGER,
ALTER COLUMN "diagnosticoEgresoId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "EstanciaHospitalaria_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "EstudioEspecial" DROP CONSTRAINT "EstudioEspecial_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "formatoHospId" SET DATA TYPE INTEGER,
ALTER COLUMN "registradoPor" SET DATA TYPE INTEGER,
ADD CONSTRAINT "EstudioEspecial_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "EvolucionMedica" DROP CONSTRAINT "EvolucionMedica_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "formatoHospId" SET DATA TYPE INTEGER,
ALTER COLUMN "evolucionadoPor" SET DATA TYPE INTEGER,
ADD CONSTRAINT "EvolucionMedica_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ExamenFisicoCompleto" DROP CONSTRAINT "ExamenFisicoCompleto_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "formatoHospId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "ExamenFisicoCompleto_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ExamenFuncional" DROP CONSTRAINT "ExamenFuncional_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "formatoHospId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "ExamenFuncional_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ExamenRegional" DROP CONSTRAINT "ExamenRegional_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "encuentroId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "ExamenRegional_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FormatoEmergencia" DROP CONSTRAINT "FormatoEmergencia_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "admisionId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "FormatoEmergencia_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FormatoHospitalizacion" DROP CONSTRAINT "FormatoHospitalizacion_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "admisionId" SET DATA TYPE INTEGER,
ALTER COLUMN "pacienteId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "FormatoHospitalizacion_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ImpresionDiagnostica" DROP CONSTRAINT "ImpresionDiagnostica_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "encuentroId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "ImpresionDiagnostica_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Interconsulta" DROP CONSTRAINT "Interconsulta_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "pacienteId" SET DATA TYPE INTEGER,
ALTER COLUMN "admisionId" SET DATA TYPE INTEGER,
ALTER COLUMN "medicoSolicitanteId" SET DATA TYPE INTEGER,
ALTER COLUMN "medicoDestinoId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Interconsulta_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Laboratorio" DROP CONSTRAINT "Laboratorio_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "formatoHospId" SET DATA TYPE INTEGER,
ALTER COLUMN "registradoPor" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Laboratorio_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "OrdenMedica" DROP CONSTRAINT "OrdenMedica_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "formatoHospId" SET DATA TYPE INTEGER,
ALTER COLUMN "ordenadoPor" SET DATA TYPE INTEGER,
ALTER COLUMN "cumplidaPor" SET DATA TYPE INTEGER,
ADD CONSTRAINT "OrdenMedica_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Paciente" DROP CONSTRAINT "Paciente_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PersonalAutorizado" DROP CONSTRAINT "PersonalAutorizado_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "usuarioId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "PersonalAutorizado_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PersonalMilitar" DROP CONSTRAINT "PersonalMilitar_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "pacienteId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "PersonalMilitar_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ResumenIngreso" DROP CONSTRAINT "ResumenIngreso_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "formatoHospId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "ResumenIngreso_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SignosVitales" DROP CONSTRAINT "SignosVitales_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "encuentroId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "SignosVitales_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SignosVitalesHosp" DROP CONSTRAINT "SignosVitalesHosp_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "formatoHospId" SET DATA TYPE INTEGER,
ALTER COLUMN "registradoPor" SET DATA TYPE INTEGER,
ADD CONSTRAINT "SignosVitalesHosp_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "PersonalAutorizado" ADD CONSTRAINT "PersonalAutorizado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "Interconsulta" ADD CONSTRAINT "Interconsulta_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interconsulta" ADD CONSTRAINT "Interconsulta_admisionId_fkey" FOREIGN KEY ("admisionId") REFERENCES "Admision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interconsulta" ADD CONSTRAINT "Interconsulta_medicoSolicitanteId_fkey" FOREIGN KEY ("medicoSolicitanteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interconsulta" ADD CONSTRAINT "Interconsulta_medicoDestinoId_fkey" FOREIGN KEY ("medicoDestinoId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
