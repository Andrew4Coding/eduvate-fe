import prisma from "prisma/prisma";
import { use } from "react";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { getUser } from "~/lib/auth-client";

export async function quizEndLoader(args: LoaderFunctionArgs) {
  const id = args.params.id;
  const user = await getUser(args.request);

  if (!user) return redirect("/auth");

  // only student filter
  //   if (user.role !== "student") return redirect("/");

  const quiz = await prisma.quiz.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      _count: {
        select: {
            QuizQuestion: true,
        },
      },
      QuizSubmission: {
        where: {
          student: { id: user.id },
        },
        select: {
            createdAt: true,
            updatedAt: true,
            _count: {
                select: {
                    QuizSubmissionAnswer: true,
                },
            },
        },
      },
    },
  });

  return quiz;
}
