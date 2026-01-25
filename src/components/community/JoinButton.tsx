"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JoinButton({ communityId, isJoined }: { communityId: number; isJoined: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

    if (isJoined) {
    return (
        <Link 
        href={`/dashboard/community/${communityId}`}
        className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 text-[10px] font-black uppercase italic rounded-xl hover:bg-blue-500/40 transition-all text-center"
        >
        Enter Guild Hall
        </Link>
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