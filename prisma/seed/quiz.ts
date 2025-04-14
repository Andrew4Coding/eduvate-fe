import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const school = await prisma.school.create({
    data: {
        code: 'ABCDED',
      name: 'SMA Harapan Bangsa',
      address: 'Jl. Kebangsaan No.123',
    },
  });

  const teacherUser = await prisma.user.create({
    data: {
      name: 'Ibu Sari',
      email: 'sari@school.com',
      password: 'securepassword',
      emailVerified: true,
    },
  });

  const teacher = await prisma.teacher.create({
    data: {
      userId: teacherUser.id,
      schoolId: school.id,
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      name: 'Budi Santoso',
      email: 'budi@student.com',
      password: 'password123',
      emailVerified: true,
    },
  });

  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      schoolId: school.id,
    },
  });

  const course = await prisma.course.create({
    data: {
      name: 'Dasar-Dasar Matematika',
      code: 'MATH101',
      category: 'MATHEMATICS',
      students: { connect: { id: student.id } },
      teachers: { connect: { id: teacher.id } },
    },
  });

  const section = await prisma.courseSection.create({
    data: {
      name: 'Pengenalan Matematika',
      description: 'Materi awal untuk memahami dasar matematika.',
      courseId: course.id,
    },
  });

  const courseItem = await prisma.courseItem.create({
    data: {
      name: 'Quiz 1 - Operasi Dasar',
      description: 'Quiz untuk menguji pemahaman operasi dasar matematika.',
      type: 'QUIZ',
      courseSectionId: section.id,
    },
  });

  const quiz = await prisma.quiz.create({
    data: {
      title: 'Quiz Matematika: Operasi Dasar',
      description: 'Quiz ini mencakup penjumlahan, pengurangan, dan pembagian dasar.',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 hari dari sekarang
      duration: 60,
      courseItemId: courseItem.id,
    },
  });

  const questions = [
    {
      question: 'Berapakah hasil dari 15 + 27?',
      answer: '42',
      correctAnswer: '42',
      options: ['40', '42', '43', '45'],
      explanation: '15 ditambah 27 adalah 42.',
    },
    {
      question: 'Jika kamu memiliki 50 apel dan memberikan 17 ke temanmu, berapa sisa apel yang kamu miliki?',
      answer: '33',
      correctAnswer: '33',
      options: ['30', '32', '33', '35'],
      explanation: '50 - 17 = 33.',
    },
    {
      question: 'Berapakah hasil dari 36 dibagi 6?',
      answer: '6',
      correctAnswer: '6',
      options: ['5', '6', '7', '8'],
      explanation: '36 : 6 = 6.',
    },
  ];

  for (const q of questions) {
    const quizQuestion = await prisma.quizQuestion.create({
      data: {
        question: q.question,
        answer: q.answer,
        correctAnswer: q.correctAnswer,
        options: q.options,
        explanation: q.explanation,
        quizId: quiz.id,
      },
    });

    for (const option of q.options) {
      await prisma.quizQuestionChoice.create({
        data: {
          text: option,
          quizQuestionId: quizQuestion.id,
        },
      });
    }
  }

  console.log('Quiz seeded successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });