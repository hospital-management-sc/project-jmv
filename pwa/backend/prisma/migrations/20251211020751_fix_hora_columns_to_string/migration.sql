/*
  Warnings:

  - The `horaAdmision` column on the `Admision` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `horaAlta` column on the `Admision` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hora` column on the `Encuentro` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Admision" DROP COLUMN "horaAdmision",
ADD COLUMN     "horaAdmision" VARCHAR(8),
DROP COLUMN "horaAlta",
ADD COLUMN     "horaAlta" VARCHAR(8);

-- AlterTable
ALTER TABLE "Encuentro" DROP COLUMN "hora",
ADD COLUMN     "hora" VARCHAR(8);
