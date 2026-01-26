import { db } from "@/lib/db";
import { communities, guildQuests, communityMembers } from "@/db/schema/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Shield, Sword, Send, Users, MessageSquare } from "lucide-react";

export default async function GuildHallPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const guildId = parseInt(id);

  if (isNaN(guildId)) return notFound();

  // 1. Ambil Data Guild
  const guild = await db.query.communities.findFirst({
    where: eq(communities.id, guildId),
  });

  if (!guild) return notFound();

  // 2. Cek Member/Leader
  const isMember = await db.query.communityMembers.findFirst({
    where: and(
      eq(communityMembers.communityId, guildId),
      eq(communityMembers.userId, session.user.id)
    ),
  });

  const isLeader = guild.creatorId === session.user.id;
  if (!isMember && !isLeader) redirect("/dashboard/community");

  // 3. Ambil Daftar Quest
  const quests = await db.select().from(guildQuests).where(eq(guildQuests.communityId, guildId));

  return (
    <div className="flex bg-[#020617] min-h-screen text-slate-100">
      <Sidebar />
      
      <main className="w-full md:ml-64 p-4 md:p-8 pt-24 md:pt-8 flex flex-col gap-8">
        
        {/* HERO SECTION */}
        <header className="p-8 bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Shield size={120} className="text-blue-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full">Guild Hall</span>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              {guild.name}
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl font-medium text-sm">{guild.description}</p>
          </div>
        </header>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* LEFT: MISSIONS (3 Columns on Large Screen) */}
          <div className="xl:col-span-3 space-y-6">
            <div className="flex items-center gap-3">
              <Sword className="text-blue-500" size={20} />
              <h2 className="text-lg font-black italic uppercase tracking-tight">Available Missions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quests.length > 0 ? (
                quests.map((quest) => (
                  <div key={quest.id} className="bg-slate-900/40 border border-slate-800 p-5 rounded-[2rem] hover:border-blue-500/50 transition-all group flex flex-col justify-between min-h-[200px]">
                    <div>
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <h3 className="text-sm font-bold text-white uppercase italic leading-tight">{quest.title}</h3>
                        <span className="text-[9px] font-black text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md border border-yellow-500/20 shrink-0">
                          +{quest.xpReward} XP
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-3 mb-4">{quest.description}</p>
                    </div>
                    <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase text-[9px] transition-all italic active:scale-95">
                      Claim Reward
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 border-2 border-dashed border-slate-800 rounded-[2rem] text-center">
                  <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">No Strategic Objectives Found.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: GUILD CHAT */}
          <div className="xl:col-span-1 h-[500px] xl:h-[calc(100vh-200px)] flex flex-col bg-slate-900/20 border border-slate-800 rounded-[2.5rem] overflow-hidden sticky top-8">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-blue-500" />
                <span className="text-xs font-black uppercase italic">Guild Comms</span>
              </div>
              <Users size={14} className="text-slate-500" />
            </div>

            {/* CHAT MESSAGES CONTAINER */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-blue-500 uppercase ml-1">System</span>
                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-2xl rounded-tl-none">
                  <p className="text-[11px] text-slate-300 font-medium">Welcome to the Command Center, Hero. Communication is key to victory.</p>
                </div>
              </div>
              {/* Pesan chat lain akan di-map di sini */}
            </div>

            {/* CHAT INPUT */}
            <div className="p-4 bg-slate-900/40 border-t border-slate-800">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Broadcast message..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-[11px] text-white focus:border-blue-500 outline-none transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-white transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}