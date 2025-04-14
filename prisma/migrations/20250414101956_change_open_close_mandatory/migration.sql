/*
  Warnings:

  - Made the column `closeDate` on table `Quiz` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dueDate` on table `Quiz` required. This step will fail if there are existing NULL values in that column.
  - Made the column `openDate` on table `Quiz` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Quiz" ALTER COLUMN "closeDate" SET NOT NULL,
ALTER COLUMN "dueDate" SET NOT NULL,
ALTER COLUMN "openDate" SET NOT NULL;
