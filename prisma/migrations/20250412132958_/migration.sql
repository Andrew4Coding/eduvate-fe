/*
  Warnings:

  - The values [Quiz] on the enum `COURSEITEM_TYPE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "COURSEITEM_TYPE_new" AS ENUM ('MATERIAL', 'QUIZ', 'TASK');
ALTER TABLE "CourseItem" ALTER COLUMN "type" TYPE "COURSEITEM_TYPE_new" USING ("type"::text::"COURSEITEM_TYPE_new");
ALTER TYPE "COURSEITEM_TYPE" RENAME TO "COURSEITEM_TYPE_old";
ALTER TYPE "COURSEITEM_TYPE_new" RENAME TO "COURSEITEM_TYPE";
DROP TYPE "COURSEITEM_TYPE_old";
COMMIT;
