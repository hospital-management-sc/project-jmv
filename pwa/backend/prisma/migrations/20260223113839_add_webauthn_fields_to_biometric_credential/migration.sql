/*
  Warnings:

  - Added the required column `publicKey` to the `BiometricCredential` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BiometricCredential" ADD COLUMN     "attestationObject" TEXT,
ADD COLUMN     "clientDataJSON" TEXT,
ADD COLUMN     "credentialBackedUp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastVerificationError" TEXT,
ADD COLUMN     "publicKey" TEXT NOT NULL,
ADD COLUMN     "signCount" INTEGER NOT NULL DEFAULT 0;
