/*
  Warnings:

  - You are about to drop the column `reason` on the `Appointment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('FOLLOW_UP', 'CONSULTATION', 'CHECK_UP');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED');

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "reason",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'CHECK_UP';
