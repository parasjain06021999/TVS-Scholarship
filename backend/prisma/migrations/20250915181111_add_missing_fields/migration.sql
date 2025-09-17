-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "sessionId" TEXT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "ifscCode" TEXT,
ADD COLUMN     "processedAt" TIMESTAMP(3);
