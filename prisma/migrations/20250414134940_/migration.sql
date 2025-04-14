/*
  Warnings:

  - Made the column `transcripted` on table `Material` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Material" ALTER COLUMN "transcripted" SET NOT NULL;
