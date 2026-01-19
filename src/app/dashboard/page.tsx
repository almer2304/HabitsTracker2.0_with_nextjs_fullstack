import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import Sidebar from "@/components/Sidebar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Ambil data asli dari database
  const userHabits = await db.select()
    .from(habits)
    .where(eq(habits.userId, session?.user?.id as string));

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100">
      <Sidebar />
      
      {/* Berikan ml-0 di HP dan ml-64 di Desktop */}
      <main className="w-full md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {session?.user?.name}! 👋</h1>
          <p className="text-slate-400 text-sm md:text-base">Siap untuk menaikkan level habit-mu hari ini?</p>
        </header>

        {/* Stats Grid: 1 kolom di HP, 3 kolom di Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
            <p className="text-slate-400 text-sm">Total XP</p>
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-400">2,450 XP</h3>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
            <p className="text-slate-400 text-sm">Current Streak</p>
            <h3 className="text-2xl md:text-3xl font-bold text-orange-500">7 Days 🔥</h3>
          </div>
        </div>

        {/* Habit List */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4 text-center md:text-left">Daily Quests (Habits)</h2>
          {userHabits.length === 0 ? (
            <p className="text-slate-500 italic text-center">Belum ada habit. Mulai petualanganmu!</p>
          ) : (
            <div className="space-y-3">
              {userHabits.map((habit) => (
                <div key={habit.id} className="flex flex-col sm:flex-row items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-blue-500 gap-4">
                  <span className="font-medium">{habit.name}</span>
                  <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
                    COMPLETE +10XP
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}