import QuizProgressModule from "~/modules/QuizProgressModule";
import QuizStartModule from "~/modules/QuizStartModule";
import { quizStartLoader} from "~/modules/QuizStartModule/loader";

export { quizStartLoader as loader };

export default function QuizStartPage() {
  return <QuizStartModule />;
}
