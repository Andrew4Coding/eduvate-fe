import QuizReviewModule from "~/modules/QuizReviewModule";
import { quizReviewLoader } from "~/modules/QuizReviewModule/loader";

export { quizReviewLoader as loader };

export default function QuizReviewPage() {
  return <QuizReviewModule />;
}