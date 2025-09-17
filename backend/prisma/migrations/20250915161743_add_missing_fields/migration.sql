-- AlterEnum
ALTER TYPE "CommunicationStatus" ADD VALUE 'SCHEDULED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'APPLICATION_UPDATE';
ALTER TYPE "NotificationType" ADD VALUE 'DOCUMENT_REQUEST';
ALTER TYPE "NotificationType" ADD VALUE 'PAYMENT_UPDATE';
ALTER TYPE "NotificationType" ADD VALUE 'DEADLINE_REMINDER';
ALTER TYPE "NotificationType" ADD VALUE 'ANNOUNCEMENT';

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'FINANCE_OFFICER';

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "riskLevel" TEXT;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "priority" TEXT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "bankReference" TEXT,
ADD COLUMN     "upiReference" TEXT;
