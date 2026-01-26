"use client";

import { useState, useEffect, useRef, use } from "react";
import { MessageSquare, X, Send, User, Shield, Zap } from "lucide-react";
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

  // FETCH DATA HALL (Guild & Quests)
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

  // FETCH MESSAGES
  const fetchMessages = async () => {
    const res = await fetch(`/api/community/chat?communityId=${guildId}`);
    if (res.ok) {
      const data = await res.json();
      setChatList(data);
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Real-time polling
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatList]);

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden">
      <Sidebar />

      <motion.div animate={{ filter: isChatOpen ? "blur(20px)" : "blur(0px)", scale: isChatOpen ? 0.98 : 1 }} className="w-full md:ml-64 p-6 md:p-10 pt-24 md:pt-10">
        <header className="mb-12 p-10 bg-blue-600/10 border border-blue-500/20 rounded-[3rem]">
          <h1 className="text-5xl font-black italic uppercase text-white tracking-tighter">
            {guild?.name || "GUILD"} <span className="text-blue-500">HALL</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium italic">{guild?.description}</p>
        </header>

        {/* 3 KOLOM QUEST */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quests.map((q) => (
            <div key={q.id} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-black text-white uppercase italic">{q.title}</h3>
                  <span className="text-[10px] font-black text-yellow-500">+{q.xpReward} XP</span>
                </div>
                <p className="text-xs text-slate-500 mb-6">{q.description}</p>
              </div>
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-[10px] italic transition-all">Execute Mission</button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* TOMBOL CHAT DI KANAN BAWAH */}
      {!isChatOpen && (
        <button onClick={() => setIsChatOpen(true)} className="fixed bottom-10 right-10 p-6 bg-blue-600 rounded-[2rem] shadow-xl z-[100] active:scale-90 transition-transform">
          <MessageSquare size={32} className="text-white" />
        </button>
      )}

      {/* CHAT OVERLAY */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-md">
            <div className="absolute inset-0 bg-black/40" onClick={() => setIsChatOpen(false)} />
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="bg-[#0f172a] border border-blue-500/30 w-full max-w-2xl h-[80vh] rounded-[3.5rem] flex flex-col overflow-hidden relative z-[120]">
              <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-blue-500" />
                  <span className="font-black uppercase italic text-white tracking-widest">Alliance Comms</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"><X size={24} /></button>
              </div>

              <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6">
                {chatList.map((chat, i) => (
                  <div key={i} className={`flex items-start gap-3 ${chat.user?.name === session?.user?.name ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-blue-400 flex items-center justify-center overflow-hidden shrink-0">
                      {chat.user?.image ? <img src={chat.user.image} alt="avatar" /> : <User size={20} className="text-white" />}
                    </div>
                    <div className={`flex flex-col ${chat.user?.name === session?.user?.name ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] font-black text-blue-500 uppercase italic mb-1">{chat.user?.name || "Soldier"}</span>
                      <div className={`p-4 rounded-2xl max-w-sm ${chat.user?.name === session?.user?.name ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-100 rounded-tl-none'}`}>
                        <p className="text-sm font-medium">{chat.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-slate-900/60 border-t border-slate-800 flex gap-4">
                <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500 transition-all" placeholder="Relay message..." />
                <button onClick={handleSendMessage} className="p-4 bg-blue-600 rounded-2xl hover:bg-blue-400 transition-all"><Send size={20} /></button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}