/*
  Warnings:

  - You are about to drop the column `file_type` on the `material` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "material" DROP COLUMN "file_type",
ADD COLUMN     "audio_url" TEXT;
