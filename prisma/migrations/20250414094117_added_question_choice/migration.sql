-- CreateTable
CREATE TABLE "QuizQuestionChoice" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "quizQuestionId" TEXT NOT NULL,

    CONSTRAINT "QuizQuestionChoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizQuestionChoice" ADD CONSTRAINT "QuizQuestionChoice_quizQuestionId_fkey" FOREIGN KEY ("quizQuestionId") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
