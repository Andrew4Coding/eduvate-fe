/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CourseToSchool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schools` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToSchool" DROP CONSTRAINT "_CourseToSchool_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToSchool" DROP CONSTRAINT "_CourseToSchool_B_fkey";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "_CourseToSchool";

-- DropTable
DROP TABLE "schools";
