/*
  Warnings:

  - Changed the type of `type` on the `CourseItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "COURSEITEM_TYPE" AS ENUM ('MATERIAL', 'Quiz', 'TASK');

-- AlterTable
ALTER TABLE "CourseItem" DROP COLUMN "type",
ADD COLUMN     "type" "COURSEITEM_TYPE" NOT NULL;
