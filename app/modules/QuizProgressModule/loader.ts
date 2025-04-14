import prisma from "prisma/prisma";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { getUser } from "~/lib/auth-client";

export default async function quizLoader(args: LoaderFunctionArgs) {
    const id = args.params.id;
    const user = await getUser(args.request);

    if (!user) return redirect('/auth');

    // only student filter
    if (user.role !== 'student') return redirect('/');

    const quiz = await prisma.quiz.findUnique({
        where: {
            id: id,
        },
        include: {
            QuizQuestion: {
                omit: {
                    answer: true,
                },
            },
            QuizSubmission: {
                where: {
                    student: {
                        id: user.id,
                    },
                },
                include: {
                    QuizSubmissionAnswer: true,
                },
                take: 1,
            },
        },
    });

    return quiz;
}