"use client";

import { useState, useEffect, useRef, use } from "react";
import { MessageSquare, X, Send, User, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";

export default function GuildHallPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const guildId = resolvedParams.id;
  const { data: session } = useSession();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState<any[]>([]);
  const [quests, setQuests] = useState<any[]>([]);
  const [guild, setGuild] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/community/${guildId}`);
      if (res.ok) {
        const data = await res.json();
        setGuild(data.guild);
        setQuests(data.quests);
      }
    };
    fetchData();
  }, [guildId]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/community/chat?communityId=${guildId}`);
      if (res.ok) {
        const data = await res.json();
        setChatList(data);
      }
    } catch (err) { console.error("Gagal ambil chat"); }
  };

  useEffect(() => {
    if (isChatOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 4000);
      return () => clearInterval(interval);
    }
  }, [isChatOpen, guildId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const content = message;
    setMessage("");

    await fetch("/api/community/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ communityId: guildId, content }),
    });
    fetchMessages();
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-100 flex overflow-x-hidden">
      <Sidebar />

      {/* Main Content: Ditambahkan overflow-hidden dan max-w-screen untuk cegah tembus layar */}
      <motion.div 
        animate={{ filter: isChatOpen ? "blur(10px)" : "blur(0px)" }} 
        className="flex-1 w-full md:ml-64 p-4 md:p-10 pt-20 md:pt-10 max-w-full overflow-hidden"
      >
        {/* Header: Responsive font size */}
        <header className="mb-8 p-6 md:p-10 bg-blue-600/10 border border-blue-500/20 rounded-[2rem] md:rounded-[3rem]">
          <h1 className="text-3xl md:text-5xl font-black italic uppercase text-white leading-tight">
            {guild?.name || "GUILD"} <span className="text-blue-500">HALL</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-2 italic line-clamp-2">{guild?.description}</p>
        </header>

        <h2 className="flex items-center gap-2 mb-6 font-black italic uppercase text-sm tracking-widest text-blue-500">
          <Shield size={16} /> Available Missions
        </h2>

        {/* Grid: Responsive 1 kolom (mobile) ke 3 kolom (desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {quests.map((q) => (
            <div key={q.id} className="bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-[2rem] flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-md md:text-lg font-black text-white uppercase italic leading-tight">{q.title}</h3>
                  <span className="text-[9px] font-black text-yellow-500 shrink-0">+{q.xpReward} XP</span>
                </div>
                <p className="text-[10px] md:text-xs text-slate-500 mb-6 line-clamp-3">{q.description}</p>
              </div>
              <button className="w-full py-3 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase text-[9px] italic transition-all active:scale-95">
                Execute Mission
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating Chat Button: Ukuran dikecilkan untuk mobile */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)} 
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 p-4 md:p-6 bg-blue-600 rounded-2xl md:rounded-[2rem] shadow-2xl z-[50] active:scale-90 transition-all border border-blue-400/30"
        >
          <MessageSquare size={24} className="md:w-8 md:h-8 text-white" />
        </button>
      )}

      {/* Chat Overlay: Ditambahkan padding agar tidak nembus pinggir layar mobile */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 backdrop-blur-md">
            <div className="absolute inset-0 bg-black/60" onClick={() => setIsChatOpen(false)} />
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 50, opacity: 0 }} 
              className="bg-[#0f172a] border border-blue-500/30 w-full max-w-2xl h-[85vh] md:h-[80vh] rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col overflow-hidden relative z-[120] shadow-2xl"
            >
              <div className="p-6 md:p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
                <span className="font-black uppercase italic text-sm md:text-base text-white tracking-widest">Alliance Comms</span>
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"><X size={20} /></button>
              </div>

              <div ref={scrollRef} className="flex-1 p-6 md:p-8 overflow-y-auto space-y-4 md:space-y-6 scrollbar-hide">
                {chatList.map((chat, i) => (
                  <div key={i} className={`flex items-start gap-3 ${chat.user?.name === session?.user?.name ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 border border-blue-500/30 flex items-center justify-center overflow-hidden shrink-0">
                      {chat.user?.image ? <img src={chat.user.image} alt="avatar" className="w-full h-full object-cover" /> : <User size={16} />}
                    </div>
                    <div className={`flex flex-col ${chat.user?.name === session?.user?.name ? 'items-end' : 'items-start'}`}>
                      <span className="text-[9px] font-black text-blue-500 uppercase italic mb-1">{chat.user?.name || "Soldier"}</span>
                      <div className={`p-3 md:p-4 rounded-2xl max-w-[75%] md:max-w-sm ${chat.user?.name === session?.user?.name ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-100 rounded-tl-none'}`}>
                        <p className="text-xs md:text-sm font-medium leading-relaxed">{chat.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 md:p-8 bg-slate-900/80 border-t border-slate-800 flex gap-3">
                <input 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} 
                  className="flex-1 bg-black border border-slate-800 rounded-xl px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-white focus:border-blue-500 outline-none transition-all" 
                  placeholder="Relay message..." 
                />
                <button onClick={handleSendMessage} className="p-3 md:p-4 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all active:scale-90"><Send size={18} /></button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}