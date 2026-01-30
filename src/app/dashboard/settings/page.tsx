"use client";

import { useState, useEffect } from "react";
import { User, Shield, Save, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { useSession, signOut } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  
  // State form dimulai dengan data dari session (jika ada) agar tidak kosong saat awal load
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    username: (session?.user as any)?.username || "",
  });

  // 1. Ambil data asli langsung dari Database saat halaman dibuka
  useEffect(() => {
    // Sinkronkan state dengan session jika session baru masuk
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        username: (session.user as any).username || "",
      });
    }

    // Ambil data paling fresh dari database (bypass session cache)
    async function fetchFreshData() {
      try {
        const res = await fetch("/api/user/settings"); 
        if (res.ok) {
          const data = await res.json();
          // Update form dengan data terbaru dari database
          setFormData({
            name: data.name || "",
            username: data.username || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch fresh user data", err);
      }
    }
    fetchFreshData();
  }, [session]); // Jalankan ulang jika session berubah

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const updatedUser = await res.json();

      if (res.ok) {
        // Sinkronisasi ke Session NextAuth agar Sidebar/Header ikut berubah secara instan
        await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.name,
            username: updatedUser.username,
          },
        });

        setStatus({ type: "success", msg: "Profil berhasil diperbarui!" });
      } else {
        setStatus({ type: "error", msg: updatedUser.error || "Gagal memperbarui profil" });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Kesalahan jaringan" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-10 pt-24 md:pt-10 max-w-full">
        <header className="mb-10 max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-black italic uppercase text-white tracking-tighter leading-tight">
            System <span className="text-blue-500">Settings</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-2 font-medium italic">
            Konfigurasi identitas pahlawan dan otorisasi akun.
          </p>
        </header>

        <form onSubmit={handleUpdate} className="max-w-3xl space-y-6 pb-20">
          
          {/* Status Message */}
          {status && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${
                status.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}
            >
              {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {status.msg}
            </motion.div>
          )}

          {/* SECTION: PROFILE */}
          <section className="bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem]">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                <User size={20} />
              </div>
              <h2 className="font-black uppercase italic tracking-widest text-sm">Identity Core</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Display Name</label>
                <input 
                  value={formData.name} // Terisi otomatis dari state
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl px-5 py-3 md:py-4 text-sm focus:border-blue-500 outline-none transition-all text-white"
                  placeholder="Masukkan nama baru..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Codename (Username)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 text-sm font-bold">@</span>
                  <input 
                    value={formData.username} // Terisi otomatis dari state
                    onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl pl-10 pr-5 py-3 md:py-4 text-sm focus:border-blue-500 outline-none transition-all text-white"
                    placeholder="username_baru"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: SECURITY */}
          <section className="bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem]">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                <Shield size={20} />
              </div>
              <h2 className="font-black uppercase italic tracking-widest text-sm">System Guard</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-bold">Two-Factor Auth</span>
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">Coming soon in next patch</span>
                </div>
                <div className="w-10 h-5 bg-slate-800 rounded-full cursor-not-allowed" />
              </div>
              
              <button 
                type="button"
                onClick={() => signOut()}
                className="w-full flex justify-between items-center p-4 bg-red-500/5 hover:bg-red-500/10 rounded-xl border border-red-500/10 transition-all group"
              >
                <span className="text-xs md:text-sm font-bold text-red-500/80 group-hover:text-red-500 transition-colors">Terminate Session</span>
                <LogOut size={18} className="text-red-500/50 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          </section>

          {/* SAVE BUTTON */}
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black uppercase italic rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={20} /> Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}