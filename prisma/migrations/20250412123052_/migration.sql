/*
  Warnings:

  - Added the required column `type` to the `CourseItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseItem" ADD COLUMN     "type" TEXT NOT NULL;
