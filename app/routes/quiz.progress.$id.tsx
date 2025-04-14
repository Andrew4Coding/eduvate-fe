import QuizProgressModule from "~/modules/QuizProgressModule";
import { quizProgressLoader } from "~/modules/QuizProgressModule/loader";

export { quizProgressLoader as loader };

export default function QuizProgressPage() {
  return <QuizProgressModule />;
}
