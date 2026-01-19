"use client";

import { useState, useEffect } from "react";
import { Trophy, Zap, Target, X, Sword, Shield } from "lucide-react";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Mengecek apakah user baru pertama kali melihat onboarding ini
    const hasSeenOnboarding = localStorage.getItem("habitHero_onboarding");
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Menyimpan status agar tidak muncul lagi di masa depan
    localStorage.setItem("habitHero_onboarding", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop dengan efek blur modern */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
        onClick={handleClose}
      />

      {/* Konten Modal */}
      <div className="relative w-full max-w-lg overflow-hidden bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl">
        {/* Banner Atas (Dekoratif) */}
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
          <Sword className="text-white w-10 h-10 animate-bounce" />
        </div>

        <div className="p-8 pt-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 italic">
              SELAMAT DATANG, HERO! 🎮
            </h2>
            <p className="text-slate-400 text-sm">
              Ini bukan sekadar tracker biasa. Ini adalah perjalanan untuk meningkatkan Level hidupmu.
            </p>
          </div>

          {/* Grid Penjelasan Gamifikasi */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-500">
                <Target size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-sm">DAILY QUESTS</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Selesaikan habit harianmu untuk mendapatkan **XP**. Semakin rajin, semakin cepat Levelmu naik!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-500">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-sm">STREAK MULTIPLIER</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Jangan lewatkan satu hari pun. Pertahankan **Streak** untuk mendapatkan bonus XP yang masif.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                <Trophy size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-sm">LEGENDARY BADGES</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Capai milestone tertentu untuk membuka **Badges** eksklusif yang bisa dipamerkan di profilmu.
                </p>
              </div>
            </div>
          </div>

          {/* Tombol Aksi */}
          <button
            onClick={handleClose}
            className="w-full mt-10 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-900/40"
          >
            MULAI PETUALANGAN
          </button>
          
          <p className="text-center text-[10px] text-slate-500 mt-4 tracking-widest uppercase">
            System: Protocol Initialized 1.0
          </p>
        </div>
      </div>
    </div>
  );
}