"use client"

import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import type { QuizQuestion } from "~/modules/QuizProgressModule/data/quiz-data"
import type { Prisma } from "@prisma/client"

interface QuizQuestion extends Prisma.QuizGetPayload<{
  include: {
    
  }
}> {}

interface QuestionDisplayProps {
  question: 
  selectedAnswer: string | null
  onAnswerSelect: (answerId: string) => void
}

export default function QuestionDisplay({ question, selectedAnswer, onAnswerSelect }: QuestionDisplayProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">{question.questionText}</h3>
      <RadioGroup value={selectedAnswer || ""} onValueChange={onAnswerSelect} className="space-y-3">
        {question.options.map((option: any) => (
          <div
            key={option.id}
            className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
              selectedAnswer === option.id ? "border-primary bg-primary/5" : "hover:bg-gray-50"
            }`}
          >
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id} className="flex-grow cursor-pointer font-medium">
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
