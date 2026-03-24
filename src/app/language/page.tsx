"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

const SUPPORTED_LANGUAGES = [
  "Pidgin English", "Igbo", "Ibibio", "Annang", "Efik",
  "Ijaw", "Ikwerre", "Ogoni", "Igala", "Idoma",
  "Yoruba", "Hausa", "Edo", "Urhobo", "Tiv"
];

export default function LanguageSelectionPage() {
  const router = useRouter();

  const handleSelectLanguage = (lang: string) => {
    localStorage.setItem("sabit_local_language", lang);
    router.push("/skills");
  };

  return (
    <ProtectedRoute>
      <Header />
      <main className="app-shell app-grid-tint flex-1 flex flex-col items-center p-6">
        <div className="max-w-4xl w-full space-y-8 mt-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Choose your Local Language 🌍
            </h1>
            <p className="text-lg text-slate-600">
              Select the language you want to learn vocational skills in.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => handleSelectLanguage(lang)}
                className="app-panel p-6 rounded-2xl hover:border-primary/35 hover:text-primary hover:shadow-[0_22px_48px_-32px_rgba(37,99,235,0.7)] transition-all text-center font-medium text-slate-700 active:scale-95"
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
