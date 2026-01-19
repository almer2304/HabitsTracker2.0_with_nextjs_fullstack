"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Proteksi halaman di sisi client (jika middleware belum siap)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="p-10">Loading Dashboard...</div>;
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold">Halo, {session?.user?.name}! 👋</h1>
          <p className="text-gray-500">{session?.user?.email}</p>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Statistik Kamu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <p className="text-blue-600 text-sm font-medium">Points</p>
            <p className="text-3xl font-bold text-blue-900">0</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <p className="text-green-600 text-sm font-medium">Level</p>
            <p className="text-3xl font-bold text-green-900">1</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
            <p className="text-purple-600 text-sm font-medium">Active Habits</p>
            <p className="text-3xl font-bold text-purple-900">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}