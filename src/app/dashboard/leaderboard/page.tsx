"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Crown, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";

export default function LeaderboardPage() {
  const [topUsers, setTopUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setTopUsers(data);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-24 md:pt-10">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter">
            GLOBAL <span className="text-blue-500">RANKINGS</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium italic text-sm md:text-base">
            Hanya pahlawan terbaik yang layak berada di puncak.
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-4">
          {topUsers.map((user, index) => (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              key={user.id}
              className={`relative flex items-center gap-4 p-5 rounded-[2rem] border transition-all ${
                index === 0 
                ? "bg-yellow-500/10 border-yellow-500/30 scale-105" 
                : "bg-slate-900/40 border-slate-800"
              }`}
            >
              {/* RANK NUMBER / ICON */}
              <div className="w-12 flex justify-center items-center font-black italic text-2xl shrink-0">
                {index === 0 ? <Crown className="text-yellow-500" size={32} /> : 
                 index === 1 ? <Medal className="text-slate-300" size={28} /> :
                 index === 2 ? <Medal className="text-orange-500" size={28} /> :
                 <span className="text-slate-600">#{index + 1}</span>}
              </div>

              {/* AVATAR */}
              <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-blue-500/30 overflow-hidden shrink-0">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <UserIcon size={20} />
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1">
                <h3 className="font-black uppercase italic text-sm md:text-base tracking-wide">
                  {user.name || "Anonymous Hero"}
                </h3>
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                  Level {user.level || 1}
                </p>
              </div>

              {/* XP SCORE */}
              <div className="text-right shrink-0">
                <div className="text-sm md:text-lg font-black italic text-white leading-none">
                  {user.xp?.toLocaleString() || 0}
                </div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                  Total XP
                </div>
              </div>

              {/* HIGHLIGHT FOR TOP 1 */}
              {index === 0 && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase italic animate-pulse">
                  Legend
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}