/*
  Warnings:

  - You are about to drop the column `indicaciones` on the `FormatoEmergencia` table. All the data in the column will be lost.
  - You are about to drop the column `procedencia` on the `FormatoEmergencia` table. All the data in the column will be lost.
  - You are about to drop the column `spo2` on the `FormatoEmergencia` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FormatoEmergencia" DROP COLUMN "indicaciones",
DROP COLUMN "procedencia",
DROP COLUMN "spo2",
ADD COLUMN     "abdomen" TEXT,
ADD COLUMN     "anoRecto" TEXT,
ADD COLUMN     "antecedentesFamiliares" TEXT,
ADD COLUMN     "antecedentesPersonales" TEXT,
ADD COLUMN     "cabeza" TEXT,
ADD COLUMN     "cardiovascular" TEXT,
ADD COLUMN     "cuello" TEXT,
ADD COLUMN     "examenGeneral" TEXT,
ADD COLUMN     "fechaExamen" DATE,
ADD COLUMN     "genital" TEXT,
ADD COLUMN     "habitosPsicobiologicos" TEXT,
ADD COLUMN     "horaExamen" TIME,
ADD COLUMN     "neurologico" TEXT,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "peso" DECIMAL(5,2),
ADD COLUMN     "piel" TEXT,
ADD COLUMN     "pulmones" TEXT,
ADD COLUMN     "talla" DECIMAL(5,2),
ADD COLUMN     "torax" TEXT;

-- CreateIndex
CREATE INDEX "FormatoEmergencia_fechaExamen_idx" ON "FormatoEmergencia"("fechaExamen");
