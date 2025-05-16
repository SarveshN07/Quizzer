
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getQuizAttemptById, QuizAttempt } from "@/models/quiz";
import { useAuth } from "@/contexts/AuthContext";

const QuizResult = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      if (!attemptId) {
        navigate("/dashboard");
        return;
      }

      setLoading(true);
      try {
        // Get the specific attempt
        const attemptData = await getQuizAttemptById(attemptId);
        
        if (!attemptData || attemptData.userId !== user.id) {
          navigate("/dashboard");
          return;
        }

        setAttempt(attemptData);
      } catch (error) {
        console.error("Error loading quiz result:", error);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [attemptId, navigate, user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getResultEmoji = (score: number) => {
    if (score >= 90) return "🎉";
    if (score >= 70) return "👍";
    if (score >= 50) return "🤔";
    return "😢";
  };

  const getResultMessage = (score: number) => {
    if (score >= 90) return "Excellent work!";
    if (score >= 70) return "Good job!";
    if (score >= 50) return "Not bad, keep learning!";
    return "Keep practicing!";
  };

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto p-4 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto p-4 py-8 animate-fade-in">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground text-center">
          <div className="text-5xl mb-2">{getResultEmoji(attempt!.score)}</div>
          <CardTitle className="text-3xl">Quiz Results</CardTitle>
          <CardDescription className="text-primary-foreground/90">
            {attempt!.categoryName} Quiz • {formatDate(attempt!.attemptedAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center my-8">
            <div className="text-7xl font-bold mb-4">
              {attempt!.score}%
            </div>
            <p className="text-xl">{getResultMessage(attempt!.score)}</p>
            <p className="text-muted-foreground mt-2">
              You got {attempt!.correctAnswers} out of {attempt!.totalQuestions} questions correct
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-6 md:flex-row">
            <Button 
              className="flex-1" 
              onClick={() => navigate(`/quiz/${attempt!.categoryId}`)}
            >
              Try Again
            </Button>
            <Button 
              className="flex-1"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResult;
