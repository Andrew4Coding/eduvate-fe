/*
  Warnings:

  - Added the required column `category` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "COURSE_CATEGORY" AS ENUM ('SOCIOLOGY', 'GEOGRAPHY', 'ENGLISH', 'MATHEMATICS', 'ECONOMICS', 'HISTORY', 'SCIENCE', 'ART', 'MUSIC', 'PHYSICAL_EDUCATION', 'STATISTICS');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "category" "COURSE_CATEGORY" NOT NULL;
