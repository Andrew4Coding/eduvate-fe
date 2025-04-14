/*
  Warnings:

  - You are about to drop the column `userId` on the `Student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
