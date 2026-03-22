-- CreateTable
CREATE TABLE "vehicle_health_answers" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "estimatedKm" INTEGER,
    "estimatedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_health_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vehicle_health_answers_vehicleId_idx" ON "vehicle_health_answers"("vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_health_answers_vehicleId_type_key" ON "vehicle_health_answers"("vehicleId", "type");

-- AddForeignKey
ALTER TABLE "vehicle_health_answers" ADD CONSTRAINT "vehicle_health_answers_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
