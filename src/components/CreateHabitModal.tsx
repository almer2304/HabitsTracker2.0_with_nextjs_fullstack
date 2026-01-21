"use client";

import { useState } from "react";
import { X, Plus, Target, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateHabitModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    // Kita akan buat server action ini nanti
    const res = await fetch("/api/habits", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("name"),
        category: formData.get("category"),
        difficulty: formData.get("difficulty"),
      }),
    });

    if (res.ok) {
      setIsOpen(false);
      router.refresh(); // Memicu update data di dashboard & page ini
    }
  }

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/40"
    >
      <Plus size={20} /> NEW QUEST
    </button>
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white italic">CREATE NEW QUEST</h2>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X /></button>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 uppercase font-bold">Quest Name</label>
            <input name="name" required className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 mt-1 focus:border-blue-500 outline-none text-white" placeholder="e.g., Morning Coding" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 uppercase font-bold">Category</label>
              <select name="category" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 mt-1 outline-none text-white">
                <option>Health</option>
                <option>Coding</option>
                <option>Reading</option>
                <option>Social</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase font-bold">Difficulty</label>
              <select name="difficulty" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 mt-1 outline-none text-white">
                <option>Easy (+10 XP)</option>
                <option>Medium (+25 XP)</option>
                <option>Hard (+50 XP)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black text-white mt-4 shadow-xl">
            START QUEST
          </button>
        </form>
      </div>
    </div>
  );
}