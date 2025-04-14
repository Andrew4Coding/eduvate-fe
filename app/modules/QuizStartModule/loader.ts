import prisma from "prisma/prisma";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { getUser } from "~/lib/auth-client";

export async function quizStartLoader(args: LoaderFunctionArgs) {
  const id = args.params.id;
  const user = await getUser(args.request);

  if (!user) return redirect("/auth");

  // only student filter
//   if (user.role !== "student") return redirect("/");

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: id,
    },
    select: {
        id: true,
        title: true,
        description: true,
        openDate: true,
        duration: true,
        dueDate: true,
        _count: {
            select: {
                QuizQuestion: true,
            },
        },
    },
  });

  return quiz;
}
