/*
  Warnings:

  - You are about to drop the column `fecha` on the `SignosVitalesHosp` table. All the data in the column will be lost.
  - Added the required column `medicoId` to the `SignosVitalesHosp` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SignosVitalesHosp_fecha_idx";

-- AlterTable
ALTER TABLE "Encuentro" ADD COLUMN     "examenFisico" JSONB;

-- AlterTable
ALTER TABLE "SignosVitalesHosp" DROP COLUMN "fecha",
ADD COLUMN     "medicoId" INTEGER NOT NULL;
