/*
  Warnings:

  - You are about to drop the column `description` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `isHidden` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `isHidden` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `isHidden` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Material" DROP COLUMN "description",
DROP COLUMN "isHidden",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "description",
DROP COLUMN "isHidden",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "description",
DROP COLUMN "isHidden",
DROP COLUMN "name";
