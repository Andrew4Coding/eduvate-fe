import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import QuestionDisplay from "./question-display";
import NavigationButtons from "./navigation-button";
import QuestionGrid from "./question-grid";
import Timer from "./timer";
import { type Quiz as BaseQuiz } from "../index"; // Renamed to BaseQuiz

// Extended Quiz type to include isAlreadyCompleted
interface Quiz extends BaseQuiz {
  isAlreadyCompleted?: boolean;
}

export default function QuizContainer({ quiz }: { quiz: Quiz }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(quiz?.duration ? quiz.duration * 60 : 0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (quiz?.duration) {
      setTimeRemaining(quiz.duration * 60);
    }
  }, [quiz?.duration]);

  const handleAnswerSelect = async (answerId: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerId;
    setUserAnswers(newAnswers);

    // Optimistically update UI, then save to backend
    try {
      await fetch("/api/quiz/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz.id,
          quizAttemptId: quiz.QuizSubmission[0]?.id, // Assuming the attempt ID is available
          questionId: quiz.QuizQuestion[currentQuestionIndex].id,
          answer: answerId,
        }),
      });
    } catch (error) {
      console.error("Failed to save answer:", error);
      // Optionally: revert optimistic update or show error to user
    }
  };

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

  const handleSubmitQuiz = async () => {
    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz.id,
          questionSeq: quiz.QuizQuestion.map((question) => question.id),
          answers: userAnswers,
          quizAttemptId: quiz.QuizSubmission[0]?.id,
        }),
      });

      if (response.ok) {
        setQuizCompleted(true);
        navigate(`/quiz/end/${quiz.id}`);
      } else {
        console.error("Failed to submit quiz:", await response.text());
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleTimeExpired = () => {
    setQuizCompleted(true);
  };

  useEffect(() => {
    if (!quiz || !quiz.QuizQuestion || !Array.isArray(quiz.QuizQuestion)) {
      setUserAnswers([]);
      return;
    }

    const submission = quiz.QuizSubmission && quiz.QuizSubmission[0];
    const userAnswersFromDb = submission && submission.QuizSubmissionAnswer ? submission.QuizSubmissionAnswer : [];

    const orderedUserAnswers = Array(quiz.QuizQuestion.length).fill(null);
    const questionIdsInOrder = quiz.QuizQuestion.map((question) => question.id);

    userAnswersFromDb.forEach((dbAnswer) => {
      if (dbAnswer && dbAnswer.quizQuestionId && dbAnswer.answer) {
        const questionIndex = questionIdsInOrder.indexOf(dbAnswer.quizQuestionId);
        if (questionIndex !== -1) {
          orderedUserAnswers[questionIndex] = dbAnswer.answer;
        }
      }
    });

    setUserAnswers(orderedUserAnswers);
  }, [quiz]);

  if (quiz?.isAlreadyCompleted) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Quiz Already Completed</h2>
        <p>You have already completed this quiz.</p>
        <button 
          onClick={() => navigate(`/quiz/${quiz.id}/review`)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Review Answers
        </button>
      </div>
    );
  }

  if (!quiz || !quiz.QuizQuestion) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <p>Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Question {currentQuestionIndex + 1} of {quiz.QuizQuestion.length}
        </h2>
        <Timer
          timeRemaining={timeRemaining}
          setTimeRemaining={setTimeRemaining}
          onTimeExpired={handleTimeExpired}
          quizCompleted={quizCompleted}
        />
      </div>
      <>
        <QuestionDisplay
          question={quiz.QuizQuestion[currentQuestionIndex]}
          selectedAnswer={userAnswers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
        />
        <NavigationButtons
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={quiz.QuizQuestion.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmitQuiz}
          allQuestionsAnswered={!userAnswers.includes(null)}
        />

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">Question Navigator</h3>
          <QuestionGrid
            totalQuestions={quiz.QuizQuestion.length}
            currentQuestionIndex={currentQuestionIndex}
            answeredQuestions={userAnswers.map((answer) => answer !== null)}
            onQuestionSelect={handleJumpToQuestion}
          />
        </div>
      </>
    </div>
  );
}
