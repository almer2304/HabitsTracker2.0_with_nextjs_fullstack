"use client";
import { useState } from "react";
import CreateGuildModal from "./CreateGuildModal";
import DispatchQuestModal from "./DispatchQuestModal";

export function EstablishGuildButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black italic uppercase shadow-[0_0_20px_rgba(37,99,235,0.4)]"
      >
        + Establish Guild
      </button>
      <CreateGuildModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function DispatchQuestButton({ guildId }: { guildId: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div 
        onClick={() => setOpen(true)}
        className="mb-4 py-1 px-3 border border-dashed border-blue-500/50 rounded-lg text-center cursor-pointer hover:bg-blue-500/10 transition-colors"
      >
        <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">
          + Dispatch Guild Quest
        </span>
      </div>
      <DispatchQuestModal isOpen={open} onClose={() => setOpen(false)} guildId={guildId} />
    </>
  );
}