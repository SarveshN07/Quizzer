
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { getUserQuizAttempts, fetchCategories, QuizAttempt, QuizCategory } from "@/models/quiz";
import { useAuth } from "@/contexts/AuthContext";

const History = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [filteredAttempts, setFilteredAttempts] = useState<QuizAttempt[]>([]);
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        // Load categories and user attempts
        const [fetchedCategories, userAttempts] = await Promise.all([
          fetchCategories(),
          getUserQuizAttempts(user.id)
        ]);

        setCategories(fetchedCategories);
        setAttempts(userAttempts);
        setFilteredAttempts(userAttempts);
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [navigate, user]);

  useEffect(() => {
    if (categoryFilter === "all") {
      setFilteredAttempts(attempts);
    } else {
      setFilteredAttempts(
        attempts.filter((attempt) => attempt.categoryId === categoryFilter)
      );
    }
  }, [categoryFilter, attempts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto p-4 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <p>Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto p-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quiz History</h1>
          <p className="text-muted-foreground">View all your past quiz attempts</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center">
          <span className="mr-2">Filter by category:</span>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Quiz Attempts</CardTitle>
          <CardDescription>
            {filteredAttempts.length} attempt{filteredAttempts.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAttempts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No quiz attempts found</p>
              <Link to="/dashboard">
                <Button>Take Your First Quiz</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Score</th>
                    <th className="text-left py-3 px-4">Correct Answers</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{attempt.categoryName}</td>
                      <td className="py-3 px-4">{formatDate(attempt.attemptedAt)}</td>
                      <td className="py-3 px-4">{attempt.score}%</td>
                      <td className="py-3 px-4">
                        {attempt.correctAnswers}/{attempt.totalQuestions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
