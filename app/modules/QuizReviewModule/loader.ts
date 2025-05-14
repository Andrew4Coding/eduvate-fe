import prisma from "prisma/prisma";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { getUser } from "~/lib/auth-client";

export async function quizReviewLoader(args: LoaderFunctionArgs) {
  const quizIdFromParams = args.params.id;
  const user = await getUser(args.request);

  if (!user || !user.id) {
    return redirect("/auth");
  }

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!student) {
    console.error("Student record not found for user:", user.id);
    return redirect("/"); // Or an appropriate error page
  }

  const studentId = student.id;

  // 1. Fetch the quiz details, including correct answers for review
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizIdFromParams,
    },
    include: {
      QuizQuestion: {
        include: {
          QuizQuestionChoice: true,
          // Correct answers are needed for review, so no omit: { answer: true }
        },
      },
    },
  });

  if (!quiz) {
    console.error(`Quiz not found for review: ${quizIdFromParams}`);
    return redirect("/"); // Or a 404 page
  }

  // 2. Fetch the specific graded QuizSubmission for this student and quiz
  const quizSubmission = await prisma.quizSubmission.findFirst({
    where: {
      quizId: quiz.id,
      studentId: studentId,
      isGraded: true, // Crucial: only fetch graded submissions for review
    },
    include: {
      QuizSubmissionAnswer: true, // To show what the user answered
    },
    orderBy: {
      createdAt: 'desc', // Get the latest graded submission if multiple (should ideally be one)
    },
  });

  if (!quizSubmission) {
    console.error(`No graded submission found for quiz ${quiz.id} by student ${studentId}`);
    // Redirect if no submission to review, perhaps to the quiz start or end page
    // or show a message that there's nothing to review.
    return redirect(`/quiz/end/${quiz.id}`); // Or a more appropriate page
  }

  // 3. Combine quiz data with the specific submission for the review context
  // The quiz object already contains QuizQuestions. We'll pass the submission separately or attach it.
  return { quiz, quizSubmission };
} 