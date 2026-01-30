"use client";

import { useState } from "react";
import { Flame, Trash2, CheckCircle2, Filter, ArrowUpDown, Target, Trophy, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HabitListClient({ initialData, userId }: { initialData: any[], userId: string }) {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Logika Check-in (Selesaikan Quest)
 const handleCheckIn = async (habitId: number, difficulty: string) => {
  const xpTable: Record<string, number> = { Easy: 10, Medium: 25, Hard: 50 };
  const xpGain = xpTable[difficulty] || 10;

  try {
    const res = await fetch("/api/community/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xpGain: 25 }), // Kasih 25 XP per habit
    });

    const data = await res.json();

    if (res.ok) {
      // 1. Notifikasi XP Biasa
      toast.success(`Quest Clear! +${xpGain} XP`, {
        icon: <Zap className="text-yellow-400" size={16} />,
      });

      // 2. Loop Notifikasi untuk setiap Badge Baru yang didapat
      if (data.newBadges && data.newBadges.length > 0) {
        data.newBadges.forEach((badge: any) => {
          toast.custom((t) => (
            <div className="bg-slate-900 border-2 border-blue-500 p-4 rounded-[2rem] shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-4 animate-in fade-in zoom-in duration-300">
              <div className="bg-blue-600 p-3 rounded-full text-white shadow-lg">
                <Trophy size={20} />
              </div>
              <div className="flex flex-col text-left">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Achievement Unlocked!</p>
                <h4 className="text-sm font-bold text-white uppercase italic tracking-tight">{badge.name}</h4>
                <p className="text-[10px] text-slate-400 leading-tight">{badge.description}</p>
              </div>
            </div>
          ), { duration: 6000 }); // Badge muncul lebih lama (6 detik)
        });
      }

      router.refresh(); 
    } else {
      toast.error(data.error || "Gagal check-in");
    }
  } catch (err) {
    console.error(err);
    toast.error("Terjadi kesalahan sistem.");
  }
};

  // Logika Hapus
  const handleDelete = async (id: number) => {
    if (confirm("Hapus quest ini selamanya?")) {
      await fetch(`/api/habits?id=${id}`, { method: "DELETE" });
      router.refresh();
    }
  };

  // Logika Filter & Sort
  const filteredData = initialData
    .filter(h => filter === "All" || h.category === filter)
    .sort((a, b) => {
      if (sortBy === "streak") return b.currentStreak - a.currentStreak;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-8">
      {/* Tool Bar */}
      <div className="flex flex-wrap gap-4 bg-slate-900/40 p-5 rounded-3xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-blue-400" />
          <select 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-bold text-slate-300 focus:ring-0"
          >
            <option value="All">All Categories</option>
            <option value="Health">Health</option>
            <option value="Coding">Coding</option>
            <option value="Social">Social</option>
          </select>
        </div>
        <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
          <ArrowUpDown size={18} className="text-blue-400" />
          <select 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-bold text-slate-300 focus:ring-0"
          >
            <option value="newest">Newest</option>
            <option value="streak">Highest Streak</option>
          </select>
        </div>
      </div>

      {/* Habit Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.map((habit) => {
          const isDoneToday = habit.lastCompleted && 
            new Date(habit.lastCompleted).toDateString() === new Date().toDateString();

          return (
            <div key={habit.id} className="group relative bg-slate-900/60 border border-slate-800 p-6 rounded-[2rem] hover:border-blue-500/50 transition-all overflow-hidden shadow-xl">
              {/* Background Glow Effect */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-600/10 blur-[50px] group-hover:bg-blue-600/20 transition-all" />

              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-slate-800 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-700">
                      {habit.category}
                    </span>
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                      habit.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      habit.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                      'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}>
                      {habit.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white tracking-tight">{habit.title}</h3>
                  
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-orange-500">
                      <Flame size={20} fill="currentColor" className="animate-pulse" />
                      <span className="font-black text-lg">{habit.currentStreak}</span>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-800" />
                    <div className="text-slate-500 text-sm font-medium">
                      Total XP: {habit.currentStreak * (habit.difficulty === 'Hard' ? 50 : habit.difficulty === 'Medium' ? 25 : 10)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <button 
                    onClick={() => handleCheckIn(habit.id, habit.difficulty)}
                    disabled={isDoneToday}
                    className={`p-5 rounded-2xl transition-all shadow-2xl active:scale-90 ${
                      isDoneToday 
                      ? 'bg-green-500/20 text-green-500 cursor-not-allowed border border-green-500/30' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40'
                    }`}
                  >
                    {isDoneToday ? <Target size={28} /> : <CheckCircle2 size={28} />}
                  </button>
                  <button 
                    onClick={() => handleDelete(habit.id)}
                    className="p-2 text-slate-700 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              {isDoneToday && (
                <div className="mt-4 py-2 bg-green-500/5 border border-green-500/10 rounded-xl text-center">
                  <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">
                    Quest Completed Today
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800">
          <Target size={48} className="text-slate-700 mb-4" />
          <p className="text-slate-500 font-medium italic">Belum ada Quest di kategori ini...</p>
        </div>
      )}
    </div>
  );
}