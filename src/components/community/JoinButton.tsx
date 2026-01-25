"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function JoinButton({ communityId, isJoined }: { communityId: number; isJoined: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (isJoined) {
    return (
      <span className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-500 text-[10px] font-black uppercase italic rounded-xl">
        Joined
      </span>
    );
  }

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/community/join", {
        method: "POST",
        body: JSON.stringify({ communityId }),
      });

      if (res.ok) {
        toast.success("Welcome to the Alliance, Hero!");
        router.refresh();
      }
    } catch (err) {
      toast.error("Failed to join guild.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleJoin}
      disabled={loading}
      className="px-6 py-2 bg-slate-100 text-black hover:bg-blue-500 hover:text-white text-[10px] font-black uppercase italic rounded-xl transition-all disabled:opacity-50"
    >
      {loading ? "Joining..." : "Join Guild"}
    </button>
  );
}