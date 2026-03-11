-- CreateTable
CREATE TABLE "AdminOtpCode" (
    "id" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminOtpCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminOtpCode_createdAt_expiresAt_idx" ON "AdminOtpCode"("createdAt", "expiresAt");
