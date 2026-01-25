// src/components/community/CreateGuildModal.tsx
"use client";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateGuildModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/community/create", {
      method: "POST",
      body: JSON.stringify({ name, description: desc }),
    });

    if (res.ok) {
      toast.success("Guild Established!");
      onClose();
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-blue-500/30 p-8 rounded-[2rem] w-full max-w-md shadow-[0_0_50px_rgba(37,99,235,0.2)]">
        <h2 className="text-2xl font-black italic uppercase text-white mb-6">Establish New Guild</h2>
        <input 
          placeholder="Guild Name" 
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 mb-4 text-white focus:border-blue-500 outline-none"
          onChange={(e) => setName(e.target.value)}
        />
        <textarea 
          placeholder="Guild Description" 
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6 text-white h-32 focus:border-blue-500 outline-none"
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 px-6 py-3 border border-slate-700 rounded-xl font-bold uppercase text-xs">Abort</button>
          <button onClick={handleSubmit} className="flex-1 px-6 py-3 bg-blue-600 rounded-xl font-black uppercase text-xs shadow-lg shadow-blue-900">Initialize</button>
        </div>
      </div>
    </div>
  );
}