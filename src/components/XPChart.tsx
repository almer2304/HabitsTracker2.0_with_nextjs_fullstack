"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function XPChart() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("week");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stats/xp-growth?filter=${filter}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  return (
    // Kita paksa h-full dan min-h agar container Recharts punya dimensi
    <div className="w-full h-full min-h-[500px] bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Performance Metrics</p>
          <h3 className="text-xl md:text-2xl font-black italic uppercase text-white">XP Growth Timeline</h3>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          {["week", "month"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
                filter === f ? "bg-blue-600 text-white shadow-[0_0_15px_#3b82f666]" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {f === "week" ? "Weekly" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-[350px]">
        {data.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px" }}
                itemStyle={{ color: "#3b82f6" }}
              />
              <Area type="monotone" dataKey="xp" stroke="#3b82f6" strokeWidth={4} fill="url(#colorXp)" animationDuration={1500} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-slate-800 rounded-3xl bg-slate-950/20">
            <p className="text-slate-600 italic font-bold uppercase tracking-widest text-xs text-center px-6">
              {isLoading ? "Synchronizing Neural Data..." : "Minimal 2 data points required to generate timeline. Execute missions to begin."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}