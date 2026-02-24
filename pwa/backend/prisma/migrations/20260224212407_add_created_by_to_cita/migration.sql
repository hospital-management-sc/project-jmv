-- AlterTable
ALTER TABLE "Cita" ADD COLUMN     "createdById" INTEGER;

-- CreateIndex
CREATE INDEX "Cita_createdById_idx" ON "Cita"("createdById");

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
