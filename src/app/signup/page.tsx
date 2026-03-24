"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserProfile } from "@/lib/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Button from "@/components/Button";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await createUserProfile(userCredential.user.uid, email);
      router.push("/language");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create account.";
      setError(message);
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
            <h1 className="text-3xl font-bold text-slate-900">Join Sabi-T 👋</h1>
            <p className="text-slate-500">Create an account to start learning skills.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
              <input
                type="text"
                required
                className="app-input w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Ngozi Okafor"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                minLength={6}
                className="app-input w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" fullWidth isLoading={loading}>
                Create Account
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-slate-600 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline hover:text-primary-strong">
              Log in here
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
