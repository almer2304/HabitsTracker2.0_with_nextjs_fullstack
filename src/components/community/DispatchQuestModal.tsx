"use client";
import { useState } from "react";
import { toast } from "sonner";

interface DispatchQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guildId: number;
}

export default function DispatchQuestModal({ isOpen, onClose, guildId }: DispatchQuestModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [xpReward, setXpReward] = useState(100);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDispatch = async () => {
    if (!title || !description) {
      return toast.error("Mission intel is incomplete!");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/community/quest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communityId: guildId,
          title,
          description,
          xpReward,
        }),
      });

      if (res.ok) {
        toast.success("Guild Quest Dispatched to All Members!");
        onClose();
        // Reset form
        setTitle("");
        setDescription("");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to dispatch quest.");
      }
    } catch (err) {
      toast.error("Critical System Failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#0f172a] border border-blue-500/40 p-8 rounded-[2.5rem] w-full max-w-lg shadow-[0_0_60px_rgba(37,99,235,0.15)] relative overflow-hidden">
        {/* Dekorasi Aksen Neon */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        
        <header className="mb-8">
          <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">
            Dispatch <span className="text-blue-500">Guild Quest</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
            Assigning New Objectives for the Alliance
          </p>
        </header>

        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest">Quest Title</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. The Morning Drill" 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-700 font-bold italic"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest">Briefing Detail</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What should the heroes do?" 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white h-28 focus:border-blue-500 outline-none transition-all placeholder:text-slate-700 font-medium resize-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block tracking-widest">XP Reward Pool</label>
            <div className="flex items-center gap-4">
              <input 
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-yellow-500 font-black focus:border-yellow-500 outline-none"
              />
              <span className="text-xs font-black text-slate-500 uppercase italic">XP</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-4 border border-slate-800 rounded-2xl font-black uppercase text-[10px] text-slate-500 hover:bg-slate-800 transition-colors italic"
          >
            Abort Mission
          </button>
          <button 
            onClick={handleDispatch}
            disabled={loading}
            className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-2xl font-black uppercase text-[10px] text-white shadow-lg shadow-blue-900 transition-all italic"
          >
            {loading ? "Transmitting..." : "Initialize Quest"}
          </button>
        </div>
      </div>
    </div>
  );
}