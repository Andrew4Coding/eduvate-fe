import type { Prisma } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react"; // Icons for correct/incorrect/neutral

// Define a more specific type for QuizQuestion as used in review
interface QuizQuestionForReview extends Prisma.QuizQuestionGetPayload<{
  include: {
    QuizQuestionChoice: true;
  };
}> {}

interface ReviewQuestionDisplayProps {
  question: QuizQuestionForReview;
  userAnswer: string | null;
}

export default function ReviewQuestionDisplay({ question, userAnswer }: ReviewQuestionDisplayProps) {
  const isCorrect = userAnswer === question.correctAnswer;
  const hasAnswered = userAnswer !== null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{question.question}</span>
          {hasAnswered && (
            isCorrect ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )
          )}
          {!hasAnswered && <HelpCircle className="h-6 w-6 text-gray-400" />}
        </CardTitle>
        {question.explanation && !isCorrect && hasAnswered && (
          <CardDescription className="text-sm text-blue-600 mt-2">
            <strong>Explanation:</strong> {question.explanation}
          </CardDescription>
        )}
         {/* Show explanation if answered correctly and explanation exists */}
        {question.explanation && isCorrect && (
           <CardDescription className="text-sm text-green-600 mt-2">
            <strong>Explanation:</strong> {question.explanation}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <RadioGroup value={userAnswer || undefined} disabled className="space-y-2">
          {question.QuizQuestionChoice.map((option) => {
            const isUserThisOption = userAnswer === option.id;
            const isCorrectOption = question.correctAnswer === option.id;
            let optionStyle = "border-gray-300";
            let indicator = null;

            if (isUserThisOption) {
              optionStyle = isCorrect ? "border-green-500 ring-2 ring-green-500" : "border-red-500 ring-2 ring-red-500";
            }
            if (isCorrectOption) {
              indicator = <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />;
            } else if (isUserThisOption && !isCorrect) {
              indicator = <XCircle className="h-5 w-5 text-red-500 ml-auto" />;
            }

            return (
              <Label 
                key={option.id} 
                htmlFor={option.id} 
                className={`flex items-center p-3 border rounded-md cursor-not-allowed ${optionStyle}`}
              >
                <RadioGroupItem value={option.id} id={option.id} className="mr-2" disabled />
                <span>{option.text}</span>
                {indicator}
              </Label>
            );
          })}
        </RadioGroup>
        {hasAnswered && !isCorrect && (
          <p className="mt-4 text-sm font-semibold">
            Your answer: <span className="text-red-500">{question.QuizQuestionChoice.find(opt => opt.id === userAnswer)?.text || "Not answered"}</span>
          </p>
        )}
        <p className="mt-2 text-sm font-semibold">
          Correct answer: <span className="text-green-500">{question.QuizQuestionChoice.find(opt => opt.id === question.correctAnswer)?.text}</span>
        </p>
      </CardContent>
    </Card>
  );
} 