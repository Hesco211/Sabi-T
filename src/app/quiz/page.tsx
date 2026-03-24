"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { updateQuizScore } from "@/lib/firestore";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function QuizPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [skill, setSkill] = useState("");
  const [language, setLanguage] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ score: number; review: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    const savedSkill = localStorage.getItem("sabit_selected_skill");
    const savedLang = localStorage.getItem("sabit_delivery_language");

    if (savedSkill && savedLang) {
      setSkill(savedSkill);
      setLanguage(savedLang);
      generateQuestion(savedSkill, savedLang);
    } else {
      router.push("/skills");
    }
  }, [router]);

  const generateQuestion = async (s: string, lang: string) => {
    setIsLoading(true);
    setFeedback(null);
    setAnswer("");
    try {
      const resp = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: s, language: lang }),
      });
      const data = await resp.json();
      setQuestion(data.question);
    } catch {
      setQuestion("Could not generate a question right now. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || !user) return;

    setIsEvaluating(true);
    try {
      const resp = await fetch("/api/quiz/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill, language, question, answer }),
      });
      const data = await resp.json();
      setFeedback(data);

      if (data.score > 0) {
        await updateQuizScore(user.uid, skill, data.score);
      }
    } catch {
      setFeedback({
        score: 0,
        review: "There was an error evaluating your answer. Please try again.",
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col app-shell app-grid-tint">
        <Header />

        <main className="flex-1 max-w-3xl w-full mx-auto p-4 py-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8">
          <div className="app-panel-strong flex justify-between items-center p-6 rounded-3xl">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill Quiz</p>
              <h2 className="text-2xl font-bold text-slate-900">{skill}</h2>
            </div>
            <Button variant="outline" onClick={() => router.push("/learn")}>
              Back to Learn
            </Button>
          </div>

          <div className="app-panel-strong p-8 rounded-3xl flex flex-col gap-8 min-h-[50vh]">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-500">
                <LoadingSpinner size="lg" />
                <p>Generating your quiz question in {language}...</p>
              </div>
            ) : question ? (
              <>
                <div className="space-y-4 border-l-4 border-primary pl-6 py-2">
                  <h3 className="text-xl font-bold text-slate-800">Question:</h3>
                  <p className="text-lg text-slate-900 leading-relaxed font-medium">{question}</p>
                </div>

                {!feedback ? (
                  <form onSubmit={submitAnswer} className="space-y-4 flex-1 flex flex-col">
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="app-input w-full flex-1 min-h-[150px] p-4 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg transition-all"
                      disabled={isEvaluating}
                    />
                    <div className="flex justify-end pt-2">
                      <Button type="submit" isLoading={isEvaluating} disabled={!answer.trim()} className="w-full sm:w-auto md:min-w-[200px]">
                        Submit Answer
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6 flex-1 flex flex-col justify-center border-t border-blue-100/80 pt-8 mt-auto">
                    <div className="flex items-center gap-4">
                      <div
                        className={`text-3xl font-black w-20 h-20 rounded-full flex items-center justify-center ${
                          feedback.score >= 70
                            ? "bg-green-100 text-green-600"
                            : feedback.score >= 40
                              ? "bg-amber-100 text-amber-600"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {feedback.score}%
                      </div>
                      <h4 className="text-xl font-bold text-slate-800">
                        {feedback.score >= 70 ? "Great job!" : "Keep practicing!"}
                      </h4>
                    </div>
                    <p className="text-lg text-slate-700 bg-blue-50/85 p-6 rounded-2xl border border-blue-100/80 leading-relaxed">
                      {feedback.review}
                    </p>

                    <div className="pt-4 flex justify-end">
                      <Button onClick={() => generateQuestion(skill, language)}>
                        Next Question
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-red-500 font-medium text-lg">
                Failed to load.
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
