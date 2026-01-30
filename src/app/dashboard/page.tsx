import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits, users } from "@/db/schema/schema"; 
import { eq } from "drizzle-orm";
import Sidebar from "@/components/Sidebar";
import WelcomeModal from "@/components/WelcomeModal";
import XPChart from "@/components/XPChart";
import { Activity, Star, Flame } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return null;

  const userData = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const userHabitsData = await db.select().from(habits).where(eq(habits.userId, userId));

  const maxStreak = userHabitsData.length > 0 
    ? Math.max(...userHabitsData.map(h => h.currentStreak || 0)) 
    : 0;

  return (
    <div className="flex bg-[#020617] min-h-screen text-slate-100 overflow-x-hidden">
      <Sidebar />
      <WelcomeModal />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 flex flex-col">
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
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-5">
            <div className="p-4 bg-orange-500/10 text-orange-500 rounded-2xl"><Flame size={28} /></div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Best Streak</p>
              <h4 className="text-2xl font-black italic">{maxStreak} DAYS</h4>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-5">
            <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-2xl"><Star size={28} /></div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total XP</p>
              <h4 className="text-2xl font-black italic">{userData?.xp?.toLocaleString() ?? 0}</h4>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-5">
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl"><Activity size={28} /></div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Active Quests</p>
              <h4 className="text-2xl font-black italic">{userHabitsData.length} ACTIVE</h4>
            </div>
          </div>
        </div>

        {/* XP Growth Chart - FULL WIDTH */}
        <div className="flex-1 min-h-[500px] w-full">
            <XPChart />
        </div>
      </main>
    </div>
  );
}