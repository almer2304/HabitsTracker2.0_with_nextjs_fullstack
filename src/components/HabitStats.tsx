"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Activity, TrendingUp, Calendar } from "lucide-react";
import { format, subDays, startOfToday } from "date-fns";

export default function HabitStats() {
  const [statsData, setStatsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();

        // Mapping data agar lebih smooth untuk Chart
        const formatted = data.map((d: any) => ({
          // Format tanggal singkat (misal: 21 Jan)
          name: format(new Date(d.date), "dd MMM"),
          xp: Number(d.count) * 10, // Mengasumsikan count dikali multiplier XP
          date: d.date,
        }));

        setStatsData(formatted);
      } catch (err) {
        console.error("Gagal fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="bg-[#0f172a]/60 border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl backdrop-blur-xl h-full flex flex-col">
      {/* Header Statistik */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="text-blue-500" size={18} />
            <h3 className="text-xs font-black italic tracking-[0.2em] text-slate-500 uppercase">
              Performance Metrics
            </h3>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            XP Growth Timeline
          </h2>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-2xl">
          <div className="flex items-center gap-2 text-blue-400">
            <TrendingUp size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Leveling Up
            </span>
          </div>
        </div>
      </div>

      {/* Container Chart */}
      <div className="flex-1 min-h-[250px] w-full mt-4">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-500 italic text-sm">
            Loading neural data...
          </div>
        ) : statsData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={statsData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                {/* Efek Glow Gradient */}
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Garis Grid Tipis agar terlihat seperti radar/layar monitor */}
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#1e293b"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }}
                dy={10}
              />
              
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "16px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                  fontSize: "12px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#3b82f6", fontWeight: "bold" }}
                cursor={{ stroke: "#3b82f6", strokeWidth: 2 }}
              />

              <Area
                type="monotone" // Membuat garis melengkung halus
                dataKey="xp"
                stroke="#3b82f6"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorXp)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3 border border-dashed border-slate-800 rounded-3xl">
            <Calendar size={32} />
            <p className="text-sm italic font-medium">No activity recorded yet.</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <span>Last 7 Days Activity</span>
        <span className="text-blue-500">Auto-sync Active</span>
      </div>
    </div>
  );
}