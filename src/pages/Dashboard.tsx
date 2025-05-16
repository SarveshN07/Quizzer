
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchCategories, getUserQuizAttempts, QuizAttempt, QuizCategory } from "@/models/quiz";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setLoading(true);
        try {
          const [fetchedCategories, attempts] = await Promise.all([
            fetchCategories(),
            getUserQuizAttempts(user.id)
          ]);
          
          setCategories(fetchedCategories);
          setRecentAttempts(attempts.slice(0, 5)); // Get the 5 most recent attempts
        } catch (error) {
          console.error("Error loading dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [user]);

  if (!user) {
    return null; // Or a loading state
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto p-4 py-8 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto p-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">Select a category to start a quiz</p>
        </div>
        <Button onClick={logout} variant="outline">Logout</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {categories.map((category) => (
          <Link to={`/quiz/${category.id}`} key={category.id}>
            <div className={`quiz-card bg-${category.color} h-full`}>
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-2">{category.icon}</span>
                <h3 className="text-xl font-bold">{category.name}</h3>
              </div>
              <p className="text-sm opacity-80">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Quizzes</CardTitle>
          <CardDescription>Your recent quiz attempts</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAttempts.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">You haven't completed any quizzes yet.</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Category</th>
                    <th className="text-left py-2 px-2">Score</th>
                    <th className="text-left py-2 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">{attempt.categoryName}</td>
                      <td className="py-3 px-2">{attempt.score}% ({attempt.correctAnswers}/{attempt.totalQuestions})</td>
                      <td className="py-3 px-2">{formatDate(attempt.attemptedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {recentAttempts.length > 0 && (
            <div className="mt-4">
              <Link to="/history">
                <Button variant="outline" size="sm">View All History</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
