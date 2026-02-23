-- CreateTable
CREATE TABLE "BiometricCredential" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "credentialId" TEXT NOT NULL,
    "deviceName" VARCHAR(200) NOT NULL,
    "deviceType" VARCHAR(50) NOT NULL,
    "lastAccessedAt" TIMESTAMPTZ,
    "lastAccessedIp" VARCHAR(50),
    "lastAccessedUserAgent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "transports" VARCHAR(50)[],
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "BiometricCredential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BiometricCredential_credentialId_key" ON "BiometricCredential"("credentialId");

-- CreateIndex
CREATE INDEX "BiometricCredential_userId_idx" ON "BiometricCredential"("userId");

-- CreateIndex
CREATE INDEX "BiometricCredential_isActive_idx" ON "BiometricCredential"("isActive");

-- CreateIndex
CREATE INDEX "BiometricCredential_createdAt_idx" ON "BiometricCredential"("createdAt");

-- AddForeignKey
ALTER TABLE "BiometricCredential" ADD CONSTRAINT "BiometricCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
