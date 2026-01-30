import { db } from "@/lib/db";
import { users, xpLogs } from "@/db/schema/schema";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { xpGain } = await req.json();

    // 1. Update total XP di tabel Users dan ambil hasilnya
    const result = await db.update(users)
      .set({ xp: sql`${users.xp} + ${xpGain}` })
      .where(eq(users.id, session.user.id))
      .returning({ updatedXp: users.xp });

    const newTotalXp = result[0]?.updatedXp ?? 0;

    // 2. Catat log ke xp_logs
    await db.insert(xpLogs).values({
      userId: session.user.id,
      xpAmount: xpGain,
      totalXpSnapshot: newTotalXp,
    });

    return NextResponse.json({ success: true, newTotal: newTotalXp });
  } catch (error) {
    console.error("Execute Mission Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}