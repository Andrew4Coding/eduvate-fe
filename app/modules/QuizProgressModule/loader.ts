import prisma from "prisma/prisma";
import { redirect, type LoaderFunctionArgs } from "react-router";

export default async function quizLoader(args: LoaderFunctionArgs) {
    const id = args.params.id;

    const course = await prisma.quiz.findUnique({
        where: {
            id: id,
        },
    })

    if (!course) {
        return redirect('/404');
    }

    return course;
}