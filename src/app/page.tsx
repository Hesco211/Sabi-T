"use client";

import Header from "@/components/Header";
import Button from "@/components/Button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="app-shell app-grid-tint flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="app-panel rounded-[2rem] px-8 py-10 space-y-4">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
              Sabi-T <span className="inline-block animate-bounce">🧠</span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-primary font-semibold">
              Learn. Understand. Earn.
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-lg mx-auto leading-relaxed">
              We bring digital and vocational skills to you, in your very own local language.
              No more English barrier hindering your growth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-48 text-lg font-bold">
                Get Started
              </Button>
            </Link>

            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-48 text-lg font-bold">
                Log In
              </Button>
            </Link>
          </div>

          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium text-slate-600">
            <div className="app-panel rounded-2xl p-4">🌍 15+ Languages</div>
            <div className="app-panel rounded-2xl p-4">💬 AI Tutor Chat</div>
            <div className="app-panel rounded-2xl p-4">🛠️ Practical Skills</div>
            <div className="app-panel rounded-2xl p-4">📈 Free Access</div>
          </div>
        </div>
      </main>
    </>
  );
}
