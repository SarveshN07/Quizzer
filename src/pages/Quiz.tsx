
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchCategories,
  getQuestionsByCategory, 
  saveQuizAttempt,
  QuizQuestion, 
  QuizResponse 
} from "@/models/quiz";

const Quiz = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      if (!categoryId) {
        navigate("/dashboard");
        return;
      }

      setLoading(true);
      try {
        // Fetch category and questions
        const categories = await fetchCategories();
        const cat = categories.find(c => c.id === categoryId);
        
        if (!cat) {
          navigate("/dashboard");
          return;
        }

        setCategory(cat);
        const quizQuestions = await getQuestionsByCategory(categoryId, 5);
        setQuestions(quizQuestions);
      } catch (error) {
        console.error("Error loading quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [categoryId, navigate, user]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length ? ((currentQuestionIndex) / questions.length) * 100 : 0;

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    // Record the response
    const newResponse: QuizResponse = {
      questionId: currentQuestion.id,
      selectedOptionIndex: selectedOption,
      isCorrect: selectedOption === currentQuestion.correctAnswerIndex
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);

    // Move to next question or complete the quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // Quiz completed
      finishQuiz(updatedResponses);
    }
  };

  const finishQuiz = async (finalResponses: QuizResponse[]) => {
    setIsSubmitting(true);
    
    // Calculate score
    const correctAnswers = finalResponses.filter(r => r.isCorrect).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    // Create attempt record
    const attempt = {
      userId: user!.id,
      categoryId: categoryId!,
      categoryName: category?.name || "",
      score,
      totalQuestions: questions.length,
      correctAnswers,
      responses: finalResponses,
      attemptedAt: new Date().toISOString()
    };
    
    // Save attempt to Supabase
    try {
      const attemptId = await saveQuizAttempt(attempt);
      if (attemptId) {
        navigate(`/result/${attemptId}`);
      } else {
        throw new Error("Failed to save quiz attempt");
      }
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto p-4 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="container max-w-3xl mx-auto p-4 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <p>No questions available for this category.</p>
          <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto p-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{category?.name} Quiz</h1>
          <p className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          Exit Quiz
        </Button>
      </div>

      <Progress value={progress} className="mb-6" />

      <Card className="quiz-container">
        <CardHeader>
          <CardTitle>{currentQuestion.questionText}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`quiz-option ${selectedOption === index ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(index)}
            >
              <div className="flex items-center">
                <div className={`flex justify-center items-center w-7 h-7 rounded-full mr-3 ${
                  selectedOption === index ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleNextQuestion}
            disabled={selectedOption === null || isSubmitting}
          >
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Quiz;
