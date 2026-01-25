import { db } from "@/lib/db";
import { communities, users, communityMembers } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import { Users, ShieldCheck, Lock, Globe, Plus } from "lucide-react";
import JoinButton from "@/components/community/JoinButton";
import Link from "next/link";
import { EstablishGuildButton, DispatchQuestButton } from "@/components/community/GuildActions";

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "";

  // 1. Ambil Data User untuk cek XP (Syarat 5.000 XP)
  const userData = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  // 2. Ambil Daftar Komunitas dari Database
  const allCommunities = await db.select().from(communities);
  
  // 3. Ambil List ID Komunitas yang sudah diikuti user
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

          {/* Tombol Establish Guild - Aktif jika XP >= 5.000 */}
          {canCreate ? (
            <EstablishGuildButton /> 
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
          {allCommunities.length > 0 ? (
            allCommunities.map((guild) => {
              const isMember = joinedIds.includes(guild.id);
              const isLeader = guild.creatorId === userId; // Menggunakan creatorId dari DB

              return (
                <div key={guild.id} className="group relative bg-slate-900/30 border border-slate-800 rounded-[2.5rem] p-8 overflow-hidden transition-all hover:border-blue-500/50">
                  {/* Efek Background Shield */}
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                    <ShieldCheck size={80} className="text-blue-500" />
                  </div>

                  <div className="relative z-10">
                    {/* Badge Quest Khusus Admin */}
                    {isLeader && (
                      <DispatchQuestButton guildId={guild.id} />
                    )}

                    <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
                      <Globe className="text-blue-400" size={24} />
                    </div>
                    
                    <h3 className="text-xl font-black text-white uppercase italic mb-2 tracking-tight">
                      {guild.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mb-8 line-clamp-2 h-10">
                      {guild.description || "No mission brief provided for this guild."}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-800/50">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</span>
                          <span className="text-xs font-bold text-blue-500 uppercase italic tracking-tighter">Active</span>
                       </div>
                       
                       {/* Tombol Dinamis: Join atau Enter Hall */}
                       {isMember ? (
                         <Link 
                           href={`/dashboard/community/${guild.id}`}
                           className="px-6 py-2 bg-blue-600/20 border border-blue-500/50 text-blue-400 text-[10px] font-black uppercase italic rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                         >
                           Enter Guild Hall
                         </Link>
                       ) : (
                         <JoinButton communityId={guild.id}isJoined={joinedIds.includes(guild.id)} />
                       )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
              <Globe className="text-slate-700 mb-4 animate-pulse" size={48} />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No Guilds Discovered in this Sector.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}