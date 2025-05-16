
import { supabase } from "@/integrations/supabase/client";

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

// Fetch categories from Supabase
export const fetchCategories = async (): Promise<QuizCategory[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data.map(cat => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    color: cat.color,
    icon: cat.icon,
  }));
};

// Fetch questions by category from Supabase
export const getQuestionsByCategory = async (categoryId: string, count: number = 5): Promise<QuizQuestion[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('category_id', categoryId);

  if (error) {
    console.error("Error fetching questions:", error);
    return [];
  }

  const questions = data.map(q => ({
    id: q.id,
    categoryId: q.category_id,
    questionText: q.question_text,
    options: q.options as string[],
    correctAnswerIndex: q.correct_answer_index,
  }));

  // Shuffle and select questions
  return shuffleArray(questions).slice(0, count);
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

// Save quiz attempt to Supabase
export const saveQuizAttempt = async (attempt: Omit<QuizAttempt, "id">): Promise<string | null> => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: attempt.userId,
      category_id: attempt.categoryId,
      category_name: attempt.categoryName,
      score: attempt.score,
      total_questions: attempt.totalQuestions,
      correct_answers: attempt.correctAnswers,
      responses: attempt.responses,
      attempted_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving quiz attempt:", error);
    return null;
  }

  return data.id;
};

// Get user's quiz attempts from Supabase
export const getUserQuizAttempts = async (userId: string): Promise<QuizAttempt[]> => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('attempted_at', { ascending: false });

  if (error) {
    console.error("Error fetching quiz attempts:", error);
    return [];
  }

  return data.map(attempt => ({
    id: attempt.id,
    userId: attempt.user_id,
    categoryId: attempt.category_id,
    categoryName: attempt.category_name,
    score: attempt.score,
    totalQuestions: attempt.total_questions,
    correctAnswers: attempt.correct_answers,
    responses: attempt.responses,
    attemptedAt: attempt.attempted_at,
  }));
};

// Get a specific quiz attempt by ID from Supabase
export const getQuizAttemptById = async (attemptId: string): Promise<QuizAttempt | null> => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('id', attemptId)
    .single();

  if (error || !data) {
    console.error("Error fetching quiz attempt:", error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    categoryId: data.category_id,
    categoryName: data.category_name,
    score: data.score,
    totalQuestions: data.total_questions,
    correctAnswers: data.correct_answers,
    responses: data.responses,
    attemptedAt: data.attempted_at,
  };
};
