/*
  Warnings:

  - The `horaCita` column on the `Cita` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Cita" DROP COLUMN "horaCita",
ADD COLUMN     "horaCita" VARCHAR(8);
