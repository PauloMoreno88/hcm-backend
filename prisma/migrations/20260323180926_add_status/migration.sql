/*
  Warnings:

  - You are about to drop the column `estimatedDate` on the `vehicle_health_answers` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedKm` on the `vehicle_health_answers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "vehicle_health_answers" DROP COLUMN "estimatedDate",
DROP COLUMN "estimatedKm";
