"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { getAllSkillProgress, SkillProgress } from "@/lib/firestore";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function DashboardPage() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<Record<string, SkillProgress>>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    getAllSkillProgress(user.uid)
      .then((data) => {
        setProgressData(data);
      })
      .catch((err) => console.error("Error fetching progress", err))
      .finally(() => setIsLoading(false));
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col app-shell app-grid-tint">
        <Header />

        <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 space-y-8">
          <div className="app-panel-strong flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-3xl">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Your Dashboard ✨</h1>
              <p className="text-slate-500 mt-1">Track your personalized learning journey.</p>
            </div>
            <Button onClick={() => router.push("/skills")} variant="secondary">
              Learn a New Skill
            </Button>
          </div>

          {isLoading ? (
            <div className="py-24 text-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : Object.keys(progressData).length === 0 ? (
            <div className="app-panel-strong text-center p-12 rounded-3xl space-y-4">
              <span className="text-6xl inline-block mb-4">🌱</span>
              <h2 className="text-2xl font-bold text-slate-800">You haven&apos;t started yet!</h2>
              <p className="text-slate-500">Pick a skill and start learning in your local language.</p>
              <Button onClick={() => router.push("/skills")} className="mx-auto mt-4">
                Explore Skills
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(progressData).map(([skillName, data], index) => (
                <div key={skillName} className="app-panel-strong rounded-3xl p-6 flex flex-col space-y-6">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{skillName}</h3>
                    <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary font-bold">
                      {index % 2 === 0 ? "🔧" : "💻"}
                    </div>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-blue-100/80">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">Lessons Completed</span>
                      <span className="text-lg font-black text-slate-800">{data.lessonsCompleted}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">Best Quiz Score</span>
                      <span className="text-lg font-black text-primary">{data.quizScore}%</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      router.push("/skills");
                    }}
                    variant="outline"
                    className="mt-auto w-full"
                  >
                    Continue
                  </Button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
