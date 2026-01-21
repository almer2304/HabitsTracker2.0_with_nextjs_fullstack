import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits, users } from "@/db/schema/schema"; // Pastikan import tabel users juga
import { eq, sql } from "drizzle-orm";
import Sidebar from "@/components/Sidebar";
import HabitHeatmap from "@/components/HabitHeatmap";
import WelcomeModal from "@/components/WelcomeModal";
import HabitStats from "@/components/HabitStats";
import { Activity, Star, Flame } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return null;

  // 1. Ambil data User untuk XP (asumsi ada kolom xp di tabel users)
  const userData = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  // 2. Ambil semua habit user untuk menghitung streak atau rata-rata
  const userHabits = await db.select().from(habits).where(eq(habits.userId, userId));

  // Logic Sederhana: Ambil streak tertinggi dari semua habit yang dimiliki
  const maxStreak = userHabits.length > 0 
    ? Math.max(...userHabits.map(h => h.streak || 0)) 
    : 0;

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100">
      <Sidebar />
      <WelcomeModal />
      
      <main className="w-full md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold italic">COMMAND CENTER 🛡️</h1>
          <p className="text-slate-400 text-sm">Welcome, {session?.user?.name}.</p>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          
          {/* Streak Card */}
          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 text-orange-500 rounded-xl"><Flame /></div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider">Best Streak</p>
              <h4 className="text-xl font-bold">
                {maxStreak > 0 ? `${maxStreak} Days` : "No Data"}
              </h4>
            </div>
          </div>

          {/* XP Card */}
          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 text-yellow-500 rounded-xl"><Star /></div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider">Total XP</p>
              <h4 className="text-xl font-bold">
                {/* @ts-ignore (jika kolom xp belum dibuat di schema, default ke 0) */}
                {userData?.xp ?? 0}
              </h4>
            </div>
          </div>

          {/* Activity Card */}
          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 text-blue-500 rounded-xl"><Activity /></div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider">Habits Active</p>
              <h4 className="text-xl font-bold">
                {userHabits.length > 0 ? `${userHabits.length} Quests` : "No Active Habit"}
              </h4>
            </div>
          </div>

        </div>

        {/* Heatmap Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {userHabits.length > 0 ? (
              <HabitStats />
            ) : (
              <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-2xl text-center italic text-slate-500">
                Heatmap will appear once you complete a habit.
              </div>
            )}
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
             <h3 className="text-lg font-semibold mb-2 text-blue-400">System Status</h3>
             <p className="text-xs text-slate-500">All systems operational. Ready for questing.</p>
          </div>
        </div>
      </main>
    </div>
  );
}