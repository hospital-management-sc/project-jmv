-- AlterTable
ALTER TABLE "Admision" ADD COLUMN     "diagnosticoIngreso" TEXT,
ALTER COLUMN "tipo" DROP NOT NULL,
ALTER COLUMN "tipo" DROP DEFAULT;
