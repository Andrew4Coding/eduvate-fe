import QuizEndModule from "~/modules/QuizEndModule";
import { quizEndLoader } from "~/modules/QuizEndModule/loader";

export { quizEndLoader as loader };

export default function QuizEndPage() {
  return <QuizEndModule />;
}
