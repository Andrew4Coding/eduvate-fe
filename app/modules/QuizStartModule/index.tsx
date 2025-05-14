import { useLoaderData, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ArrowRight,
  Clock,
  FileQuestion,
  Info,
  Home,
} from "lucide-react";
import type { Prisma } from "@prisma/client";

interface Quiz
  extends Prisma.QuizGetPayload<{
    select: {
      id: true;
      title: true;
      description: true;
      duration: true;
      _count: {
        select: {
          QuizQuestion: true;
        };
      };
    };
  }> {}

export default function QuizStartModule() {
  const quiz: Quiz = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{quiz?.title}</CardTitle>
          <CardDescription>{quiz?.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <FileQuestion className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Total Questions</p>
              <p className="text-sm text-muted-foreground">
                {quiz?._count.QuizQuestion} multiple-choice questions
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Time Limit</p>
              <p className="text-sm text-muted-foreground">
                {quiz.duration} minutes to complete the quiz
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
        <CardFooter className="flex flex-col gap-4">
          <Button 
            onClick={() => navigate(`/quiz/progress/${quiz?.id}`)}
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            Start Quiz
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => navigate("/")}
            variant="outline"
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
