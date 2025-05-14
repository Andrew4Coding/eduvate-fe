import {
  CheckCircle,
  Clock,
  Home,
  RotateCcw,
  Search,
  FileQuestion,
  Eye,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { useLoaderData, useNavigate } from "react-router";
import type { Prisma } from "@prisma/client";

interface Quiz
  extends Prisma.QuizGetPayload<{
    select: {
      id: true;
      title: true;
      _count: {
        select: {
          QuizQuestion: true;
        };
      };
      QuizSubmission: {
        select: {
          createdAt: true;
          updatedAt: true;
          score: true;
          _count: {
            select: {
              QuizSubmissionAnswer: true;
            };
          };
        };
        take: 1;
      };
    };
  }> {}

export default function QuizEndModule() {
  const quiz: Quiz = useLoaderData();
  const navigate = useNavigate();

  const score = quiz.QuizSubmission[0]?.score ?? 0;
  const totalQuestions = quiz._count.QuizQuestion;
  const percentage = (score / totalQuestions) * 100;

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Quiz Completed!</CardTitle>
          <CardDescription>Here's your performance summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Score</span>
              <span className="font-medium">{score} / {totalQuestions}</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Time Taken</p>
              <p className="text-sm text-muted-foreground">
                {Math.round((new Date(quiz.QuizSubmission[0]?.updatedAt).getTime() - 
                new Date(quiz.QuizSubmission[0]?.createdAt).getTime()) / 1000 / 60)} minutes
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Questions Answered</p>
              <p className="text-sm text-muted-foreground">
                {quiz.QuizSubmission[0]?._count.QuizSubmissionAnswer} out of {totalQuestions} questions
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            onClick={() => navigate(`/quiz/${quiz.id}/review`)}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Eye className="h-4 w-4" />
            Review Answers
          </Button>
          <Button 
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
