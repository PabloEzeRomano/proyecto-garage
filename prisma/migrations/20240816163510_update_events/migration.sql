/*
  Warnings:

  - You are about to drop the column `short_description` on the `Event` table. All the data in the column will be lost.
  - Added the required column `shortDescription` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "short_description",
ADD COLUMN     "shortDescription" TEXT NOT NULL;
