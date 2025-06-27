/*
  Warnings:

  - Added the required column `referenceDay` to the `ReadingSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReadingSchedule" ADD COLUMN     "referenceDay" TEXT NOT NULL;
