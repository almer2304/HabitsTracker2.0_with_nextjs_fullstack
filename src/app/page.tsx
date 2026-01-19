"use client"; // Pakai client karena ada fungsi klik tombol

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Jika statusnya "authenticated", langsung pindah ke dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="bg-white p-10 rounded-xl text-black shadow-2xl text-center">
        <h1 className="text-2xl font-bold mb-4">Habit Tracker</h1>
        <p className="text-gray-600 mb-6">Silakan login untuk mulai mencatat habit.</p>
        
        <button
          onClick={() => signIn("google")}
          className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          <img 
            src="https://authjs.dev/img/providers/google.svg" 
            alt="Google" 
            className="w-5 h-5" 
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}