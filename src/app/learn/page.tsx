"use client";

import { useState, useEffect, useRef } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { incrementLessonComplete } from "@/lib/firestore";
import { FiSend } from "react-icons/fi";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function LearnPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [skill, setSkill] = useState("");
  const [language, setLanguage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedSkill = localStorage.getItem("sabit_selected_skill");
    const savedLang = localStorage.getItem("sabit_delivery_language");

    if (savedSkill && savedLang) {
      setSkill(savedSkill);
      setLanguage(savedLang);

      const greeting = `Welcome! I am your Sabi-T AI Tutor. Today we are learning **${savedSkill}**. I will teach you in **${savedLang}**. What would you like to know first?`;

      setMessages([{ role: "assistant", content: greeting }]);
    } else {
      router.push("/skills");
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          skill,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorData?.error || "Failed to get response");
      }

      const data = await response.json();

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);

      // Don't fail the chat flow if progress tracking cannot reach Firestore.
      try {
        await incrementLessonComplete(user.uid, skill);
      } catch (progressError) {
        console.error("Failed to update lesson progress:", progressError);
      }
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Sorry, network error! Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col app-shell app-grid-tint">
        <Header />

        <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-4">
          <div className="app-panel-strong p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Lesson</p>
              <h2 className="text-xl font-bold text-slate-900">
                {skill}
                <span className="text-sm font-medium text-primary bg-primary-soft px-2 py-1 rounded-lg ml-2">
                  {language}
                </span>
              </h2>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/dashboard")} className="py-2 px-4 text-sm">
                View Progress
              </Button>
              <Button onClick={() => router.push("/quiz")} className="py-2 px-4 text-sm">
                Take Quiz
              </Button>
            </div>
          </div>

          <div className="app-panel-strong flex-1 rounded-2xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-sm shadow-[0_18px_36px_-24px_rgba(37,99,235,0.95)]"
                        : "bg-blue-50/90 text-slate-800 rounded-tl-sm border border-blue-100/80"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-blue-50/90 border border-blue-100/80 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                    <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white/55 border-t border-blue-100/80 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your tutor something..."
                className="app-input flex-1 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary-strong disabled:opacity-50 disabled:cursor-not-allowed text-white w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-[0_18px_36px_-24px_rgba(37,99,235,0.95)] active:scale-95"
              >
                <FiSend size={20} />
              </button>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
