-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- AlterTable: add column with DONE as default so existing rows are treated as completed
ALTER TABLE "Maintenance" ADD COLUMN "status" "MaintenanceStatus" NOT NULL DEFAULT 'DONE';

-- Change default to TODO for new records going forward
ALTER TABLE "Maintenance" ALTER COLUMN "status" SET DEFAULT 'TODO';
