import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits, users } from "@/db/schema/schema"; 
import { eq } from "drizzle-orm";
import Sidebar from "@/components/Sidebar";
import WelcomeModal from "@/components/WelcomeModal";
import HabitStats from "@/components/HabitStats";
import { Activity, Star, Flame } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return null;

  // 1. Ambil data User untuk XP
  const userData = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  // 2. Ambil semua habit user
  const userHabitsData = await db.select().from(habits).where(eq(habits.userId, userId));

  // Kalkulasi streak tertinggi secara aman dari kolom currentStreak
  const maxStreak = userHabitsData.length > 0 
    ? Math.max(...userHabitsData.map(h => h.currentStreak || 0)) 
    : 0;

  return (
    <div className="flex bg-[#020617] min-h-screen text-slate-100 overflow-x-hidden">
      <Sidebar />
      <WelcomeModal />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-8">
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
            COMMAND <span className="text-blue-500">CENTER</span> 🛡️
          </h1>
          <p className="text-slate-400 text-sm font-medium italic mt-2">
            Status report for Hero: {session?.user?.name}.
          </p>
        </header>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          
          {/* Streak Card */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-5 hover:border-orange-500/30 transition-all">
            <div className="p-4 bg-orange-500/10 text-orange-500 rounded-2xl">
              <Flame size={28} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Best Streak</p>
              <h4 className="text-2xl font-black italic">
                {maxStreak > 0 ? `${maxStreak} DAYS` : "0 DAYS"}
              </h4>
            </div>
          </div>

          {/* XP Card */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-5 hover:border-yellow-500/30 transition-all">
            <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-2xl">
              <Star size={28} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total XP</p>
              <h4 className="text-2xl font-black italic">
                {userData?.xp?.toLocaleString() ?? 0}
              </h4>
            </div>
          </div>

          {/* Activity Card */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-5 hover:border-blue-500/30 transition-all">
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl">
              <Activity size={28} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Active Quests</p>
              <h4 className="text-2xl font-black italic">
                {userHabitsData.length} ACTIVE
              </h4>
            </div>
          </div>

        </div>

        {/* Main Content: Heatmap & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {userHabitsData.length > 0 ? (
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem]">
                 <HabitStats />
              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-800 p-16 rounded-[2.5rem] text-center">
                <p className="italic text-slate-500 font-bold uppercase tracking-tighter text-sm">
                  Neural link established. Heatmap will synchronize after first quest.
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 animate-pulse">
                 <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6]"></div>
                 </div>
              </div>
              <h3 className="text-sm font-black uppercase italic tracking-widest text-blue-400 mb-2">System Status</h3>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                ALL NEURAL SYSTEMS OPERATIONAL. <br/> READY FOR HABIT TRACKING.
              </p>
          </div>
        </div>
      </main>
    </div>
  );
}