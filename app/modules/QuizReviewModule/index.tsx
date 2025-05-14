import { useLoaderData } from "react-router";
import ReviewContainer from "./components/ReviewContainer"; // Will create this component next
import type { Prisma } from "@prisma/client";

// Define types for the loader data
// Quiz type should include QuizQuestions with choices and correct answers
export interface QuizForReview extends Prisma.QuizGetPayload<{
  include: {
    QuizQuestion: {
      include: {
        QuizQuestionChoice: true;
        // Ensure Prisma.QuizQuestionGetPayload includes `correctAnswer` and `explanation` by default
        // or add them to select if they are not implicitly included.
      };
    };
  };
}> {}

export interface QuizSubmissionForReview extends Prisma.QuizSubmissionGetPayload<{
  include: {
    QuizSubmissionAnswer: true;
  };
}> {}

interface LoaderData {
  quiz: QuizForReview;
  quizSubmission: QuizSubmissionForReview;
}

export default function QuizReviewPage() {
  const { quiz, quizSubmission } = useLoaderData() as LoaderData;

  if (!quiz || !quizSubmission) {
    // This case should ideally be handled by the loader redirecting,
    // but as a fallback:
    return <p>Quiz data or submission not available for review.</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Quiz Review: {quiz.title}</h1>
      <ReviewContainer quiz={quiz} quizSubmission={quizSubmission} />
    </div>
  );
} 