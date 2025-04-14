/*
  Warnings:

  - You are about to drop the column `questionId` on the `QuizSubmissionAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `quizId` on the `QuizSubmissionAnswer` table. All the data in the column will be lost.
  - Added the required column `quizQuestionId` to the `QuizSubmissionAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuizSubmissionAnswer" DROP CONSTRAINT "QuizSubmissionAnswer_quizId_fkey";

-- AlterTable
ALTER TABLE "QuizSubmissionAnswer" DROP COLUMN "questionId",
DROP COLUMN "quizId",
ADD COLUMN     "quizQuestionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "QuizSubmissionAnswer" ADD CONSTRAINT "QuizSubmissionAnswer_quizQuestionId_fkey" FOREIGN KEY ("quizQuestionId") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
