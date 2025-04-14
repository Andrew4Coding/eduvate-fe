import prisma from "prisma/prisma";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";

export async function loader(args: LoaderFunctionArgs) {
    const quiz = await prisma.quiz.findMany();
    return quiz;
}

export default function QuizPage() {
    const quiz = useLoaderData();

    return (<>{JSON.stringify(quiz)}</>)
}