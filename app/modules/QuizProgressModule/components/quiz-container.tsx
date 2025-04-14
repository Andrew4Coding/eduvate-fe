"use client"

import { useEffect, useState } from "react"
import QuestionDisplay from "./question-display"
import NavigationButtons from "./navigation-button"
import QuestionGrid from "./question-grid"
import Timer from "./timer"
import { type Quiz } from '../index'

export default function QuizContainer({ quiz }: { quiz: Quiz }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (answerId: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerId;
    setUserAnswers(newAnswers);
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < quiz.QuizQuestion.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmitQuiz = () => {
    setQuizCompleted(true)
  }

  const handleTimeExpired = () => {
    setQuizCompleted(true)
  }

  useEffect(() => {
    const userAnswers = quiz.QuizSubmission[0].QuizSubmissionAnswer;
    
    const orderedUserAnswers = Array(quiz.QuizQuestion.length).fill(null);
    const questionIds = quiz.QuizQuestion.map(question => question.id);
    
    userAnswers.forEach(ans => {
      let idx = questionIds.indexOf(ans.id);
      orderedUserAnswers[idx] = ans.id;
    });

    setUserAnswers([...orderedUserAnswers]);
  }, [])

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

      {!quizCompleted ? (
        <>
          <QuestionDisplay
            question={quiz.QuizQuestion[currentQuestionIndex]}
            selectedAnswer={userAnswers[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
          />

          <NavigationButtons
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={quizData.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmitQuiz}
            allQuestionsAnswered={!userAnswers.includes(null)}
          />

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3">Question Navigator</h3>
            <QuestionGrid
              totalQuestions={quizData.length}
              currentQuestionIndex={currentQuestionIndex}
              answeredQuestions={userAnswers.map((answer) => answer !== null)}
              onQuestionSelect={handleJumpToQuestion}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-lg mb-4">
            Your score: {calculateScore()} out of {quizData.length}
          </p>
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Question Summary</h3>
            {quizData.map((question, index) => (
              <div key={index} className="mb-4 text-left">
                <p className="font-medium">
                  {index + 1}. {question.questionText}
                </p>
                <p className="text-sm mt-1">
                  Your answer:{" "}
                  {userAnswers[index]
                    ? question.options.find((opt) => opt.id === userAnswers[index])?.text || "Not answered"
                    : "Not answered"}
                </p>
                <p
                  className={`text-sm mt-1 ${userAnswers[index] === question.correctAnswer ? "text-green-600" : "text-red-600"}`}
                >
                  Correct answer: {question.options.find((opt) => opt.id === question.correctAnswer)?.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
