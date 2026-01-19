"use client";

import { useState } from "react";
import { Flame, Filter, ArrowUpDown } from "lucide-react";

export default function HabitListClient({ initialData }: { initialData: any[] }) {
  const [sortBy, setSortBy] = useState("name");
  const [filterCategory, setFilterCategory] = useState("All");

  const sortedData = [...initialData]
    .filter(h => filterCategory === "All" || h.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === "streak") return b.streak - a.streak;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-6">
      {/* Tool Bar */}
      <div className="flex flex-wrap gap-4 bg-slate-900/30 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 text-sm">
          <Filter size={16} className="text-blue-400" />
          <select 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-transparent outline-none border-b border-slate-700 pb-1"
          >
            <option value="All">All Categories</option>
            <option value="Health">Health</option>
            <option value="Coding">Coding</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ArrowUpDown size={16} className="text-blue-400" />
          <select 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent outline-none border-b border-slate-700 pb-1"
          >
            <option value="name">Sort by Name</option>
            <option value="streak">Sort by Streak</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedData.map((habit) => (
          <div key={habit.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl hover:border-blue-500/50 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md uppercase font-bold tracking-widest">
                  {habit.category}
                </span>
                <h3 className="text-xl font-bold mt-2 text-white">{habit.name}</h3>
                <div className="flex items-center gap-4 mt-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1 text-orange-500 font-bold">
                    <Flame size={16} /> {habit.streak} DAY STREAK
                  </span>
                </div>
              </div>
              <button className="bg-slate-800 group-hover:bg-blue-600 p-4 rounded-2xl transition-all font-black">
                CHECK
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
          <p className="text-slate-500">No quests found. Time to create one!</p>
        </div>
      )}
    </div>
  );
}