import { useLoaderData, useOutletContext } from "react-router";
import QuizContainer from "./components/quiz-container";
import type { Prisma } from "@prisma/client";

export interface Quiz
  extends Prisma.QuizGetPayload<{
    include: {
      QuizQuestion: {
        omit: {
          answer: true;
        };
      };
      QuizSubmission: {
        include: {
          QuizSubmissionAnswer: true;
        };
        take: 1,
      };
    };
  }> {}

export default function QuizProgressModule() {
  const user = useOutletContext();
  const quiz: Quiz = useLoaderData();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Quiz Application</h1>
      <QuizContainer quiz={quiz} />
    </main>
  );
}
