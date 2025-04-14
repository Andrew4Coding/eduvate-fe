import {
  CheckCircle,
  Clock,
  Home,
  RotateCcw,
  Search,
  FileQuestion,
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
import { useLoaderData } from "react-router";
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

  let timeSecond = Math.round((quiz.QuizSubmission[0].updatedAt.getTime() - quiz.QuizSubmission[0].createdAt.getTime()) / 1000);
  let timeMinute = Math.round(timeSecond / 60);
  timeSecond -= timeMinute * 60; 

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            You've completed the quiz!
          </CardTitle>
          <CardDescription>Great job on finishing {quiz.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Score</span>
              <span className="font-medium">${quiz.QuizSubmission[0].score}/10</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>

          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileQuestion className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Questions</span>
              </div>
              <span className="text-sm">{quiz._count.QuizQuestion}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Questions Answered</span>
              </div>
              <span className="text-sm">{quiz.QuizSubmission[0]._count.QuizSubmissionAnswer}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Time Taken</span>
              </div>
              <span className="text-sm">{timeMinute}:{timeSecond}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="grid grid-cols-2 gap-2 w-full">
            <a href="/quiz/review">
              <Button variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Review Answers
              </Button>
            </a>
            <a href="/">
              <Button variant="outline" className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Quiz
              </Button>
            </a>
          </div>
          <a href="/" className="w-full">
            <Button variant="default" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
