"use client"

import { Button } from "~/components/ui/button"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"

interface NavigationButtonsProps {
  currentQuestionIndex: number
  totalQuestions: number
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  allQuestionsAnswered: boolean
  isReviewMode?: boolean
}

export default function NavigationButtons({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  allQuestionsAnswered,
  isReviewMode = false,
}: NavigationButtonsProps) {
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  return (
    <div className="flex justify-between mt-6">
      <Button variant="outline" onClick={onPrevious} disabled={isFirstQuestion} className="flex items-center gap-1">
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {isReviewMode ? (
        isLastQuestion ? (
          <Button onClick={onNext} disabled className="flex items-center gap-1 bg-green-500 hover:bg-green-600">
            End of Review
            <CheckCircle className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={onNext} className="flex items-center gap-1">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )
      ) : isLastQuestion ? (
        <Button onClick={onSubmit} className="flex items-center gap-1" disabled={!allQuestionsAnswered}>
          Submit Quiz
        </Button>
      ) : (
        <Button onClick={onNext} className="flex items-center gap-1">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
