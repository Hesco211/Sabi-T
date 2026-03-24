"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DIGITAL_SKILLS = [
  "Basic Python", "Basic HTML", "Basic CSS", "Basic JavaScript", "Basic Graphics Design"
];

const VOCATIONAL_SKILLS = [
  "Solar Installation", "Phone Repair", "Tailoring", "Electrical Works"
];

export default function SkillSelectionPage() {
  const router = useRouter();
  const [localLanguage] = useState<string>(() => {
    if (typeof window === "undefined") return "Local Language";
    return localStorage.getItem("sabit_local_language") ?? "Local Language";
  });
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isDigital, setIsDigital] = useState<boolean>(true);
  const [chosenDeliveryLanguage, setChosenDeliveryLanguage] = useState<string>("");

  useEffect(() => {
    if (!localStorage.getItem("sabit_local_language")) {
      router.push("/language");
    }
  }, [router]);

  const handleSelectSkill = (skill: string, type: "digital" | "vocational") => {
    setSelectedSkill(skill);
    setIsDigital(type === "digital");
    setChosenDeliveryLanguage("");
  };

  const handleStartLearning = () => {
    if (selectedSkill && chosenDeliveryLanguage) {
      localStorage.setItem("sabit_selected_skill", selectedSkill);
      localStorage.setItem("sabit_skill_type", isDigital ? "digital" : "vocational");
      localStorage.setItem("sabit_delivery_language", chosenDeliveryLanguage);
      router.push("/learn");
    }
  };

  return (
    <ProtectedRoute>
      <Header />
      <main className="app-shell app-grid-tint flex-1 flex flex-col items-center p-6 pb-24">
        <div className="max-w-4xl w-full space-y-10 mt-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              What do you want to learn? 🚀
            </h1>
            <p className="text-lg text-slate-600">
              Pick a skill and choose your preferred language for it.
            </p>
          </div>

          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                💻 Digital Skills
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {DIGITAL_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSelectSkill(skill, "digital")}
                    className={`p-6 rounded-2xl border transition-all text-left font-medium ${
                      selectedSkill === skill
                        ? "app-panel-strong border-primary/30 bg-primary-soft/70 text-primary shadow-[0_22px_48px_-34px_rgba(37,99,235,0.9)]"
                        : "app-panel text-slate-700 hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                🛠️ Vocational Skills
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {VOCATIONAL_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSelectSkill(skill, "vocational")}
                    className={`p-6 rounded-2xl border transition-all text-left font-medium ${
                      selectedSkill === skill
                        ? "app-panel-strong border-primary/30 bg-primary-soft/70 text-primary shadow-[0_22px_48px_-34px_rgba(37,99,235,0.9)]"
                        : "app-panel text-slate-700 hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedSkill && (
            <div className="app-panel-strong p-6 rounded-3xl space-y-4 animate-in fade-in slide-in-from-bottom-8">
              <h3 className="text-lg font-bold text-slate-900">
                How should we teach you <span className="text-primary">{selectedSkill}</span>?
              </h3>

              <div className="flex flex-wrap gap-3">
                {isDigital ? (
                  <>
                    <button
                      onClick={() => setChosenDeliveryLanguage("English")}
                      className={`px-6 py-3 rounded-xl border font-medium transition-all ${
                        chosenDeliveryLanguage === "English"
                          ? "bg-primary text-white border-primary shadow-[0_18px_36px_-24px_rgba(37,99,235,0.9)]"
                          : "app-input text-slate-700 hover:bg-blue-50"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setChosenDeliveryLanguage("Pidgin English")}
                      className={`px-6 py-3 rounded-xl border font-medium transition-all ${
                        chosenDeliveryLanguage === "Pidgin English"
                          ? "bg-primary text-white border-primary shadow-[0_18px_36px_-24px_rgba(37,99,235,0.9)]"
                          : "app-input text-slate-700 hover:bg-blue-50"
                      }`}
                    >
                      Pidgin English
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setChosenDeliveryLanguage(localLanguage)}
                      className={`px-6 py-3 rounded-xl border font-medium transition-all ${
                        chosenDeliveryLanguage === localLanguage
                          ? "bg-primary text-white border-primary shadow-[0_18px_36px_-24px_rgba(37,99,235,0.9)]"
                          : "app-input text-slate-700 hover:bg-blue-50"
                      }`}
                    >
                      {localLanguage}
                    </button>
                    <button
                      onClick={() => setChosenDeliveryLanguage("English")}
                      className={`px-6 py-3 rounded-xl border font-medium transition-all ${
                        chosenDeliveryLanguage === "English"
                          ? "bg-primary text-white border-primary shadow-[0_18px_36px_-24px_rgba(37,99,235,0.9)]"
                          : "app-input text-slate-700 hover:bg-blue-50"
                      }`}
                    >
                      English
                    </button>
                  </>
                )}
              </div>

              {chosenDeliveryLanguage && (
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleStartLearning} className="w-full sm:w-auto">
                    Start Learning Now
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
