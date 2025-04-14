"use client"

import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

interface QuestionGridProps {
  totalQuestions: number
  currentQuestionIndex: number
  answeredQuestions: boolean[]
  onQuestionSelect: (index: number) => void
}

export default function QuestionGrid({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  onQuestionSelect,
}: QuestionGridProps) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
      {Array.from({ length: totalQuestions }).map((_, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className={cn(
            "h-10 w-10 p-0",
            currentQuestionIndex === index && "border-primary bg-primary/10",
            answeredQuestions[index] && currentQuestionIndex !== index && "bg-green-100 border-green-300",
          )}
          onClick={() => onQuestionSelect(index)}
        >
          {index + 1}
        </Button>
      ))}
    </div>
  )
}
