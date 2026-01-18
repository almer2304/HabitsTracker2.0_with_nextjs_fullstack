"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function TestAuthPage() {
  const { data: session, status } = useSession();

  // Tampilan saat Loading
  if (status === "loading") {
    return <div className="p-10 text-center">Sedang mengecek sesi...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
        <h1 className="text-2xl font-bold mb-6">Habit Tracker Auth Test</h1>

        {session ? (
          // Tampilan jika USER SUDAH LOGIN
          <div>
            <div className="mb-4">
              {session.user?.image && (
                <img 
                  src={session.user.image} 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-full mx-auto mb-4 border"
                />
              )}
              <p className="text-lg font-semibold">Halo, {session.user?.name}!</p>
              <p className="text-gray-500">{session.user?.email}</p>
            </div>
            
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition"
            >
              Log Out
            </button>
            <p className="mt-4 text-xs text-green-600 font-medium">
              Data kamu sudah tersimpan di database MySQL!
            </p>
          </div>
        ) : (
          // Tampilan jika USER BELUM LOGIN
          <div>
            <p className="mb-6 text-gray-600">Silakan login untuk mulai mencatat habit.</p>
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-6 py-2 rounded-md transition shadow-sm mx-auto"
            >
              <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </main>
  );
}