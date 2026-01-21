import { db } from "@/lib/db";
import { badges, userBadges } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Trophy, Lock, Star, Zap, Flame, Shield, Target } from "lucide-react";
import Sidebar from "@/components/Sidebar";

// Helper untuk memetakan nama badge ke ikon yang sesuai
const getBadgeIcon = (name: string, isUnlocked: boolean) => {
  const props = { size: 40, className: isUnlocked ? "text-blue-400" : "text-slate-600" };
  switch (name) {
    case "First Step": return <Zap {...props} />;
    case "Consistent Hero": return <Flame {...props} />;
    case "XP Titan": return <Trophy {...props} />;
    case "Veteran": return <Shield {...props} />;
    default: return <Star {...props} />;
  }
};

export default async function BadgesPage() {
  const session = await getServerSession(authOptions);
  
  // Ambil data Master Badges dan Badge yang sudah dimiliki user
  const allBadges = await db.select().from(badges);
  const myBadges = await db
    .select()
    .from(userBadges)
    .where(eq(userBadges.userId, session?.user?.id || ""));

  return (
    <div className="flex bg-[#020617] min-h-screen text-slate-100">
      <Sidebar />
      
      <main className="w-full md:ml-64 p-6 md:p-10 pt-24 md:pt-10">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-blue-500" size={24} />
            <h2 className="text-xs font-black italic tracking-[0.3em] text-blue-500/80 uppercase">
              Hero Achievements
            </h2>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
            HALL OF <span className="text-blue-500">FAME</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Kumpulkan lencana prestisius dengan menyelesaikan berbagai tantangan.
          </p>
        </header>

        {/* Grid Stats Singkat */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-3xl">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Collected</p>
            <p className="text-2xl font-black text-white">{myBadges.length} / {allBadges.length}</p>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {allBadges.map((badge) => {
            const unlockedData = myBadges.find((mb) => mb.badgeId === badge.id);
            const isUnlocked = !!unlockedData;

            return (
              <div 
                key={badge.id} 
                className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center text-center overflow-hidden ${
                  isUnlocked 
                  ? 'bg-blue-600/5 border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.1)] hover:border-blue-500/60' 
                  : 'bg-slate-900/20 border-slate-800/50 grayscale'
                }`}
              >
                {/* Background Glow Effect untuk Badge yang Unlocked */}
                {isUnlocked && (
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-600/20 blur-[40px] group-hover:bg-blue-600/40 transition-all" />
                )}

                {/* Badge Icon */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${
                  isUnlocked ? 'bg-blue-600/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-slate-800/50'
                }`}>
                  {isUnlocked ? (
                    getBadgeIcon(badge.name, true)
                  ) : (
                    <Lock size={32} className="text-slate-700" />
                  )}
                </div>
                
                <h3 className={`font-black text-sm mb-2 uppercase tracking-tight ${isUnlocked ? 'text-white' : 'text-slate-600'}`}>
                  {badge.name}
                </h3>
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed px-2">
                  {badge.description}
                </p>

                {/* Footer Info Badge */}
                <div className="mt-6 w-full pt-4 border-t border-slate-800/50">
                  {isUnlocked ? (
                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em]">
                      Earned {new Date(unlockedData.earnedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">
                      Requirement: {badge.requirement}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {allBadges.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-900 rounded-[3rem]">
            <Target size={48} className="text-slate-800 mb-4" />
            <p className="text-slate-600 italic font-medium">No badges discovered in the database yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}