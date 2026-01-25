import { db } from "@/lib/db"
import { communities, guildQuests, guildMessages } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

export default async function GuildHallPage({ params }: { params: { id: string } }) {
  const guildId = parseInt(params.id);
  
  // Ambil Data Guild, Quests, dan Messages
  const guild = await db.query.communities.findFirst({ where: eq(communities.id, guildId) });
  const quests = await db.select().from(guildQuests).where(eq(guildQuests.communityId, guildId));
  const messages = await db.select().from(guildMessages).where(eq(guildMessages.communityId, guildId));

  return (
    <div className="flex bg-[#020617] min-h-screen text-slate-100">
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-black italic uppercase text-blue-500 mb-8 tracking-tighter">
          {guild?.name} Hall
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KOLOM 1: GUILD QUESTS (Dibuat oleh Admin) */}
          <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-xs font-black uppercase text-blue-400 mb-4 tracking-widest">Active Missions</h2>
            {quests.map(q => (
              <div key={q.id} className="bg-blue-600/10 border border-blue-500/30 p-4 rounded-2xl mb-3">
                <h4 className="text-sm font-bold uppercase italic">{q.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{q.description}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs font-black text-yellow-500">+{q.xpReward} XP</span>
                  <button className="text-[10px] bg-blue-600 px-3 py-1 rounded-lg uppercase font-black">Submit</button>
                </div>
              </div>
            ))}
          </section>

          {/* KOLOM 2: CHAT ROOM (Komunikasi Member) */}
          <section className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-800 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-center">
              Encrypted Communication Channel
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(m => (
                <div key={m.id} className="flex flex-col">
                  <span className="text-[10px] font-bold text-blue-500">{m.userId}</span>
                  <p className="text-sm bg-slate-800/50 p-3 rounded-2xl rounded-tl-none inline-block mt-1 border border-slate-700">
                    {m.content}
                  </p>
                </div>
              ))}
            </div>
            {/* Input Chat */}
            <div className="p-4 border-t border-slate-800">
              <input 
                placeholder="Send message to guild..." 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}