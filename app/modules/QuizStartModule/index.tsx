import type { Prisma } from "@prisma/client";
import { ArrowRight, Clock, FileQuestion, Info } from "lucide-react";
import { useLoaderData, useOutletContext } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface Quiz
  extends Prisma.QuizGetPayload<{
    select: {
      title: true;
      description: true;
      closeDate: true;
      openDate: true;
      _count: {
        select: {
          QuizQuestion: true;
        };
      };
    };
  }> {}

export default function QuizStartModule() {
  const user = useOutletContext();
  const quiz: Quiz = useLoaderData();
  const timeDelta = (quiz.closeDate?.getTime() - quiz.openDate.getTime())

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{quiz.title}</CardTitle>
          <CardDescription>{quiz.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <FileQuestion className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Total Questions</p>
              <p className="text-sm text-muted-foreground">
                {quiz._count.QuizQuestion} multiple-choice questions
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Time Limit</p>
              <p className="text-sm text-muted-foreground">
                {quiz.} minutes to complete the quiz
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Quiz Rules</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>One question at a time</li>
                <li>No going back after submitting an answer</li>
                <li>Results will be shown at the end</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <a href="/quiz/end" className="w-full">
            <Button className="w-full" size="lg">
              Start Quiz
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
