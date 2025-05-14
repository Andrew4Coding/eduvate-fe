import { useState, useMemo } from "react";
import { type QuizForReview, type QuizSubmissionForReview } from "../index"; 
import NavigationButtons from "../../QuizProgressModule/components/navigation-button"; // Re-using navigation, though submit won't be used
import QuestionGrid from "../../QuizProgressModule/components/question-grid"; // Re-using grid
import ReviewQuestionDisplay from "./ReviewQuestionDisplay";

interface ReviewContainerProps {
  quiz: QuizForReview;
  quizSubmission: QuizSubmissionForReview;
}

export default function ReviewContainer({ quiz, quizSubmission }: ReviewContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const userAnswersMap = useMemo(() => {
    const map = new Map<string, string | null>();
    quizSubmission.QuizSubmissionAnswer.forEach(ans => {
      map.set(ans.quizQuestionId, ans.answer);
    });
    return map;
  }, [quizSubmission.QuizSubmissionAnswer]);

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.QuizQuestion.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const currentQuestion = quiz.QuizQuestion[currentQuestionIndex];
  const userAnswer = userAnswersMap.get(currentQuestion.id) || null;

  // Create a dummy onSubmit for NavigationButtons as it's required, but won't be used in review.
  const dummySubmit = () => console.log("Submit button clicked in review mode - no action.");

  // For QuestionGrid, mark all questions as 'answered' for styling, as this is a review.
  const allMarkedAsAnswered = quiz.QuizQuestion.map(() => true);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          Question {currentQuestionIndex + 1} of {quiz.QuizQuestion.length}
        </h2>
        <div className="text-xl font-semibold">
          Score: {quizSubmission.score} / {quiz.QuizQuestion.length} 
          ({((quizSubmission.score / quiz.QuizQuestion.length) * 100).toFixed(2)}%)
        </div>
      </div>

      <ReviewQuestionDisplay
        question={currentQuestion}
        userAnswer={userAnswer}
      />

      <NavigationButtons
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={quiz.QuizQuestion.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={dummySubmit} // Provide dummy handler
        allQuestionsAnswered={true} // All questions considered answered for navigation
        isReviewMode={true} // Custom prop to hide submit button or change its text
      />

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3">Question Navigator</h3>
        <QuestionGrid
          totalQuestions={quiz.QuizQuestion.length}
          currentQuestionIndex={currentQuestionIndex}
          answeredQuestions={allMarkedAsAnswered} // All marked as answered
          onQuestionSelect={handleJumpToQuestion}
        />
      </div>
    </div>
  );
} 