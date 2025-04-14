"use client"

import { useEffect, useState } from "react"
import QuestionDisplay from "./question-display"
import NavigationButtons from "./navigation-button"
import QuestionGrid from "./question-grid"
import Timer from "./timer"
import { quizData } from "../data/quiz-data"
import { fetchClient } from "~/lib/fetch"

export default function QuizContainer() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(Array(quizData.length).fill(null))
  const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30 minutes in seconds
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleAnswerSelect = (answerId: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = answerId
    setUserAnswers(newAnswers)
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1) {
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

  // Calculate score when quiz is completed
  const calculateScore = () => {
    let score = 0
    userAnswers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        score++
      }
    })
    return score
  }

  useEffect(() => {
    const res = fetchClient('/quiz/${id}', )
  }, [])

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Question {currentQuestionIndex + 1} of {quizData.length}
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
            question={quizData[currentQuestionIndex]}
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
