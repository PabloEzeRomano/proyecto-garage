/*
  Warnings:

  - Added the required column `short_description` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "short_description" TEXT NOT NULL;
