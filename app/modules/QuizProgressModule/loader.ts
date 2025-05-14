import prisma from "prisma/prisma";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { getUser } from "~/lib/auth-client";

export async function quizProgressLoader(args: LoaderFunctionArgs) {
  const quizIdFromParams = args.params.id;
  const user = await getUser(args.request);

  if (!user || !user.id) return redirect("/auth");
  // Assuming user has a student profile, otherwise more checks are needed.
  // You might need to fetch student record first if user.id is not studentId.
  // For now, assuming user.id can be used to find/link student for QuizSubmission.
  // Let's get the student record first to be sure.
  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    select: { id: true }, // Only need student's own ID for the submission
  });

  if (!student) {
    // Handle case where user is not a student or student record doesn't exist
    console.error("Student record not found for user:", user.id);
    return redirect("/"); // Or an appropriate error page
  }

  const studentId = student.id;

  // 1. Fetch the quiz details
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizIdFromParams,
    },
    include: {
      QuizQuestion: {
        include: {
          QuizQuestionChoice: true,
        },
        omit: {
          answer: true, // Client-side doesn't need the correct answer during the quiz
        },
      },
    },
  });

  if (!quiz) return redirect("/");

  // 2. Find existing QuizSubmission or create a new one
  let currentQuizSubmissionWithAnswers = await prisma.quizSubmission.findFirst({
    where: {
      quizId: quiz.id,
      studentId: studentId,
    },
    include: {
      QuizSubmissionAnswer: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!currentQuizSubmissionWithAnswers) {
    currentQuizSubmissionWithAnswers = await prisma.quizSubmission.create({
      data: {
        studentId: studentId,
        quizId: quiz.id,
        score: 0,
        isGraded: false,
        answers: [],
        // QuizSubmissionAnswer will be empty for a new submission
      },
      include: {
        QuizSubmissionAnswer: true, // To match the structure even if it's empty
      }
    });
  }

  // 3. Attach the correct submission to the quiz object
  (quiz as any).QuizSubmission = [currentQuizSubmissionWithAnswers]; // Ensure it's an array

  // 4. Add a flag to indicate if the quiz is already completed and graded
  const isAlreadyCompleted = currentQuizSubmissionWithAnswers?.isGraded === true;

  return { ...quiz, isAlreadyCompleted }; // Spread quiz and add the flag
}
