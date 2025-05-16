
export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface QuizQuestion {
  id: string;
  categoryId: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuizResponse {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  responses: QuizResponse[];
  attemptedAt: string;
}

// Mock categories
export const categories: QuizCategory[] = [
  {
    id: "science",
    name: "Science",
    description: "Test your knowledge of the natural world",
    color: "quiz-science",
    icon: "🔬"
  },
  {
    id: "math",
    name: "Math",
    description: "Solve mathematical problems and equations",
    color: "quiz-math",
    icon: "🔢"
  },
  {
    id: "history",
    name: "History",
    description: "Explore events and figures from the past",
    color: "quiz-history", 
    icon: "🏛️"
  },
  {
    id: "technology",
    name: "Technology",
    description: "Learn about computers, software, and digital innovation",
    color: "quiz-technology",
    icon: "💻"
  }
];

// Mock questions
export const questions: QuizQuestion[] = [
  // Science Questions
  {
    id: "sci-1",
    categoryId: "science",
    questionText: "What planet is known as the Red Planet?",
    options: ["Earth", "Venus", "Mars", "Jupiter"],
    correctAnswerIndex: 2
  },
  {
    id: "sci-2",
    categoryId: "science",
    questionText: "Which of these is NOT a state of matter?",
    options: ["Solid", "Liquid", "Gas", "Electricity"],
    correctAnswerIndex: 3
  },
  {
    id: "sci-3",
    categoryId: "science",
    questionText: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswerIndex: 2
  },
  {
    id: "sci-4",
    categoryId: "science",
    questionText: "Which gas do plants primarily absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctAnswerIndex: 2
  },
  {
    id: "sci-5",
    categoryId: "science",
    questionText: "What is the closest star to Earth?",
    options: ["Proxima Centauri", "Alpha Centauri", "The Sun", "Sirius"],
    correctAnswerIndex: 2
  },
  
  // Math Questions
  {
    id: "math-1",
    categoryId: "math",
    questionText: "What is the square root of 64?",
    options: ["6", "8", "10", "12"],
    correctAnswerIndex: 1
  },
  {
    id: "math-2",
    categoryId: "math",
    questionText: "What is 7 x 8?",
    options: ["54", "56", "64", "72"],
    correctAnswerIndex: 1
  },
  {
    id: "math-3",
    categoryId: "math",
    questionText: "Which of these is a prime number?",
    options: ["15", "21", "33", "41"],
    correctAnswerIndex: 3
  },
  {
    id: "math-4",
    categoryId: "math",
    questionText: "What is the value of π (pi) rounded to two decimal places?",
    options: ["3.12", "3.14", "3.16", "3.18"],
    correctAnswerIndex: 1
  },
  {
    id: "math-5",
    categoryId: "math",
    questionText: "In geometry, how many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    correctAnswerIndex: 1
  },
  
  // History Questions
  {
    id: "hist-1",
    categoryId: "history",
    questionText: "Who was the first President of the United States?",
    options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"],
    correctAnswerIndex: 1
  },
  {
    id: "hist-2",
    categoryId: "history",
    questionText: "In which year did World War II end?",
    options: ["1943", "1945", "1947", "1950"],
    correctAnswerIndex: 1
  },
  {
    id: "hist-3",
    categoryId: "history",
    questionText: "Which ancient civilization built the pyramids at Giza?",
    options: ["Romans", "Greeks", "Mayans", "Egyptians"],
    correctAnswerIndex: 3
  },
  {
    id: "hist-4",
    categoryId: "history",
    questionText: "The Renaissance period began in which country?",
    options: ["France", "Germany", "Italy", "England"],
    correctAnswerIndex: 2
  },
  {
    id: "hist-5",
    categoryId: "history",
    questionText: "Which document begins with 'We the People'?",
    options: ["The Declaration of Independence", "The Constitution", "The Gettysburg Address", "The Emancipation Proclamation"],
    correctAnswerIndex: 1
  },
  
  // Technology Questions
  {
    id: "tech-1",
    categoryId: "technology",
    questionText: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Power Unit", "Central Programming Utility", "Core Processor Unit"],
    correctAnswerIndex: 0
  },
  {
    id: "tech-2",
    categoryId: "technology",
    questionText: "Which company developed the first iPhone?",
    options: ["Google", "Samsung", "Apple", "Microsoft"],
    correctAnswerIndex: 2
  },
  {
    id: "tech-3",
    categoryId: "technology",
    questionText: "In programming, what does HTML stand for?",
    options: ["HyperText Markup Language", "High Technology Modern Language", "Home Tool Markup Language", "Hybrid Text Multiple Language"],
    correctAnswerIndex: 0
  },
  {
    id: "tech-4",
    categoryId: "technology",
    questionText: "Which of these is not a programming language?",
    options: ["Java", "Python", "Chrome", "Ruby"],
    correctAnswerIndex: 2
  },
  {
    id: "tech-5",
    categoryId: "technology",
    questionText: "The cloud in cloud computing refers to:",
    options: ["Weather systems", "Remote servers accessible via the Internet", "A type of database", "A network security protocol"],
    correctAnswerIndex: 1
  }
];

// Function to get questions by category
export const getQuestionsByCategory = (categoryId: string, count: number = 5): QuizQuestion[] => {
  const categoryQuestions = questions.filter(q => q.categoryId === categoryId);
  
  // Shuffle and select questions
  return shuffleArray(categoryQuestions).slice(0, count);
};

// Helper function to shuffle array
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Quiz Storage Functions
export const saveQuizAttempt = (attempt: QuizAttempt): void => {
  const attempts = getQuizAttempts();
  attempts.push(attempt);
  localStorage.setItem("quizAttempts", JSON.stringify(attempts));
};

export const getQuizAttempts = (): QuizAttempt[] => {
  return JSON.parse(localStorage.getItem("quizAttempts") || "[]");
};

export const getUserQuizAttempts = (userId: string): QuizAttempt[] => {
  const allAttempts = getQuizAttempts();
  return allAttempts
    .filter(attempt => attempt.userId === userId)
    .sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime());
};
