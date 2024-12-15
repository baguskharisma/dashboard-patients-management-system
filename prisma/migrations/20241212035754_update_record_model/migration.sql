/*
  Warnings:

  - You are about to drop the column `date` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Record` table. All the data in the column will be lost.
  - Added the required column `allergies` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentMedications` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicalHistory` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Record" DROP COLUMN "date",
DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "allergies" TEXT NOT NULL,
ADD COLUMN     "currentMedications" TEXT NOT NULL,
ADD COLUMN     "lastVisit" TIMESTAMP(3),
ADD COLUMN     "medicalHistory" TEXT NOT NULL,
ADD COLUMN     "nextAppointment" TIMESTAMP(3);
