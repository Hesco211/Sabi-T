"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Button from "@/components/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => router.push("/language"), 50);
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="app-shell app-grid-tint flex-1 flex flex-col items-center justify-center p-4">
        <div className="app-panel-strong p-8 rounded-3xl max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back! ✨</h1>
            <p className="text-slate-500">Log in to continue learning.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
              <input
                type="email"
                required
                className="app-input w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
              <input
                type="password"
                required
                className="app-input w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" fullWidth isLoading={loading}>
                Log In
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-slate-600 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline hover:text-primary-strong">
              Sign up here
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
