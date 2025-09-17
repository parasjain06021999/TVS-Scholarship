-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "outcome" TEXT;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "readAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "failureReason" TEXT;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "email" TEXT;
