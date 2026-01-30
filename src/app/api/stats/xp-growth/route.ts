import { db } from "@/lib/db";
import { xpLogs } from "@/db/schema/schema";
import { eq, sql, and, gte } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Ambil query parameter dari URL (misal: ?filter=month)
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "week";

  const now = new Date();
  let startDate = new Date();

  // Tentukan rentang waktu berdasarkan filter
  if (filter === "month") {
    startDate.setMonth(now.getMonth() - 1); // 30 hari terakhir
  } else {
    startDate.setDate(now.getDate() - 7); // 7 hari terakhir
  }

  const logs = await db
    .select({
      // Format 'DD Mon' (misal: 26 Jan) agar lebih informatif di grafik yang lebar
      name: sql<string>`to_char(${xpLogs.createdAt}, 'DD Mon')`, 
      xp: xpLogs.totalXpSnapshot,
    })
    .from(xpLogs)
    .where(
      and(
        eq(xpLogs.userId, session.user.id),
        gte(xpLogs.createdAt, startDate)
      )
    )
    .orderBy(xpLogs.createdAt);

  return NextResponse.json(logs);
}