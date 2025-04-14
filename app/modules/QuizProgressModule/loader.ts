import prisma from "prisma/prisma";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { getUser } from "~/lib/auth-client";

export async function quizProgressLoader(args: LoaderFunctionArgs) {
  const id = args.params.id;
  const user = await getUser(args.request);

  if (!user) return redirect("/auth");

  // only student filter
  //   if (user.role !== "student") return redirect("/");

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: id,
    },
    include: {
      QuizQuestion: {
        include: {
          QuizQuestionChoice: true,
        },
        omit: {
          answer: true,
        },
      },
      QuizSubmission: {
        where: {
          student: {
            userId: user.id,
          },
        },
        include: {
          QuizSubmissionAnswer: true,
        },
        take: 1,
      },
    },
  });

  if (!quiz) return redirect("/");

  // submission
  await prisma.student.update({
    where: {
      userId: user.id,
    },
    data: {
      QuizSubmission: {
        create: {
          quiz: {
            connect: {
              id: quiz.id,
            },
          },
          score: 0,
        },
      },
    },
  });

  return quiz;
}
