import prisma from "prisma/prisma";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { getUser } from "~/lib/auth-client";

export default async function quizLoader(args: LoaderFunctionArgs) {
  const id = args.params.id;
  const user = await getUser(args.request);

  if (!user) return redirect("/auth");

  // only student filter
  if (user.role !== "student") return redirect("/");

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: id,
    },
    select: {
        title: true,
        description: true,
        closeDate: true,
        openDate: true,
        _count: {
            select: {
                QuizQuestion: true,
            },
        },
    },
  });

  return quiz;
}
