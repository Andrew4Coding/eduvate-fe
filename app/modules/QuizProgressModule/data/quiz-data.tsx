export interface QuizOption {
    id: string
    text: string
  }
  
  export interface QuizQuestion {
    id: string
    questionText: string
    options: QuizOption[]
    correctAnswer: string
  }
  
  export const quizData: QuizQuestion[] = [
    {
      id: "q1",
      questionText: "What is the capital of France?",
      options: [
        { id: "q1_a", text: "London" },
        { id: "q1_b", text: "Berlin" },
        { id: "q1_c", text: "Paris" },
        { id: "q1_d", text: "Madrid" },
      ],
      correctAnswer: "q1_c",
    },
    {
      id: "q2",
      questionText: "Which planet is known as the Red Planet?",
      options: [
        { id: "q2_a", text: "Venus" },
        { id: "q2_b", text: "Mars" },
        { id: "q2_c", text: "Jupiter" },
        { id: "q2_d", text: "Saturn" },
      ],
      correctAnswer: "q2_b",
    },
    {
      id: "q3",
      questionText: "What is the largest mammal in the world?",
      options: [
        { id: "q3_a", text: "African Elephant" },
        { id: "q3_b", text: "Blue Whale" },
        { id: "q3_c", text: "Giraffe" },
        { id: "q3_d", text: "Polar Bear" },
      ],
      correctAnswer: "q3_b",
    },
    {
      id: "q4",
      questionText: "Which of these is not a programming language?",
      options: [
        { id: "q4_a", text: "Java" },
        { id: "q4_b", text: "Python" },
        { id: "q4_c", text: "Cobra" },
        { id: "q4_d", text: "JavaScript" },
      ],
      correctAnswer: "q4_c",
    },
    {
      id: "q5",
      questionText: "In which year did World War II end?",
      options: [
        { id: "q5_a", text: "1943" },
        { id: "q5_b", text: "1945" },
        { id: "q5_c", text: "1947" },
        { id: "q5_d", text: "1950" },
      ],
      correctAnswer: "q5_b",
    },
    {
      id: "q6",
      questionText: "What is the chemical symbol for gold?",
      options: [
        { id: "q6_a", text: "Go" },
        { id: "q6_b", text: "Gd" },
        { id: "q6_c", text: "Au" },
        { id: "q6_d", text: "Ag" },
      ],
      correctAnswer: "q6_c",
    },
    {
      id: "q7",
      questionText: "Which of these is not a primary color?",
      options: [
        { id: "q7_a", text: "Red" },
        { id: "q7_b", text: "Blue" },
        { id: "q7_c", text: "Yellow" },
        { id: "q7_d", text: "Green" },
      ],
      correctAnswer: "q7_d",
    },
    {
      id: "q8",
      questionText: "What is the largest organ in the human body?",
      options: [
        { id: "q8_a", text: "Heart" },
        { id: "q8_b", text: "Liver" },
        { id: "q8_c", text: "Skin" },
        { id: "q8_d", text: "Brain" },
      ],
      correctAnswer: "q8_c",
    },
    {
      id: "q9",
      questionText: "Which country is known as the Land of the Rising Sun?",
      options: [
        { id: "q9_a", text: "China" },
        { id: "q9_b", text: "Japan" },
        { id: "q9_c", text: "Thailand" },
        { id: "q9_d", text: "South Korea" },
      ],
      correctAnswer: "q9_b",
    },
    {
      id: "q10",
      questionText: "What is the square root of 144?",
      options: [
        { id: "q10_a", text: "12" },
        { id: "q10_b", text: "14" },
        { id: "q10_c", text: "10" },
        { id: "q10_d", text: "16" },
      ],
      correctAnswer: "q10_a",
    },
  ]