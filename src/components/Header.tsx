"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="w-full p-4 bg-white/88 backdrop-blur-xl border-b border-blue-100 shadow-[0_12px_30px_-26px_rgba(59,130,246,0.28)] flex justify-between items-center z-10 sticky top-0">
      <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
        Sabi-T <span className="text-xl">🧠</span>
      </Link>
      
      {user && (
        <button 
          onClick={handleLogout}
          className="text-sm font-medium text-slate-600 hover:text-primary transition-colors px-3 py-1.5 rounded-full hover:bg-blue-50"
        >
          Logout
        </button>
      )}
    </header>
  );
}
