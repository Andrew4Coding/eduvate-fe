"use client"

import { Button } from "~/components/ui/button"
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react"

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
      <Button 
        variant="outline" 
        onClick={onPrevious} 
        disabled={isFirstQuestion} 
        className="flex items-center gap-2 hover:bg-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {isReviewMode ? (
        isLastQuestion ? (
          <Button 
            onClick={onNext} 
            disabled 
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
          >
            End of Review
            <CheckCircle className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={onNext} 
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )
      ) : isLastQuestion ? (
        <Button 
          onClick={onSubmit} 
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white" 
          disabled={!allQuestionsAnswered}
        >
          {allQuestionsAnswered ? (
            <>
              Submit Quiz
              <CheckCircle className="h-4 w-4" />
            </>
          ) : (
            <>
              Complete All Questions
              <AlertCircle className="h-4 w-4" />
            </>
          )}
        </Button>
      ) : (
        <Button 
          onClick={onNext} 
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
