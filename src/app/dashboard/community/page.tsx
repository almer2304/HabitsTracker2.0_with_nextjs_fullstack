import { db } from "@/lib/db";
import { communities, users, communityMembers } from "@/db/schema/schema";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import { Users, Plus, ShieldCheck, Lock, Globe } from "lucide-react";
import JoinButton from "@/components/community/JoinButton";

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "";

  // 1. Ambil Data User (untuk cek XP)
  const userData = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  // 2. Ambil Daftar Komunitas
  const allCommunities = await db.select().from(communities);
  
  // 3. Ambil Komunitas yang sudah diikuti user
  const userJoined = await db.select().from(communityMembers).where(eq(communityMembers.userId, userId));
  const joinedIds = userJoined.map(m => m.communityId);

  const canCreate = (userData?.xp ?? 0) >= 5000;

  return (
    <div className="flex bg-[#020617] min-h-screen text-slate-100">
      <Sidebar />

      <main className="w-full md:ml-64 p-6 md:p-10 pt-24 md:pt-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-blue-500" size={20} />
              <h2 className="text-xs font-black italic tracking-[0.3em] text-blue-500/80 uppercase">Alliance Hub</h2>
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
              GLOBAL <span className="text-blue-500">GUILDS</span>
            </h1>
          </div>

          {/* Tombol Create dengan Pengecekan XP */}
          {canCreate ? (
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black italic uppercase transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Plus size={20} /> Establish Guild
            </button>
          ) : (
            <div className="flex items-center gap-3 px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl opacity-60">
              <Lock size={18} className="text-slate-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Need 5,000 XP to Lead
              </span>
            </div>
          )}
        </header>

        {/* Grid Komunitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCommunities.map((guild) => (
            <div key={guild.id} className="group relative bg-slate-900/30 border border-slate-800 rounded-[2.5rem] p-8 overflow-hidden transition-all hover:border-blue-500/50">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                <ShieldCheck size={80} className="text-blue-500" />
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
                  <Globe className="text-blue-400" size={24} />
                </div>
                
                <h3 className="text-xl font-black text-white uppercase italic mb-2 tracking-tight">
                  {guild.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">
                  {guild.description || "No description provided for this alliance."}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-800/50">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</span>
                      <span className="text-xs font-bold text-blue-500 uppercase italic">Active</span>
                   </div>
                   
                   {/* Tombol Join Interaktif */}
                   <JoinButton 
                     communityId={guild.id} 
                     isJoined={joinedIds.includes(guild.id)} 
                   />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}