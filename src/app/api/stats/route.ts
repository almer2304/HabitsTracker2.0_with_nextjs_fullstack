import { db } from "@/lib/db";
import { habits } from "@/db/schema/schema";
import { eq, sql, and, isNotNull } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Mengambil data habit yang 'lastCompleted'-nya tidak null
    // Lalu dikelompokkan berdasarkan tanggal
    const stats = await db
      .select({
        date: sql`DATE(${habits.lastCompleted})`.as("date"),
        count: sql<number>`count(*)::int`.as("count"),
      })
      .from(habits)
      .where(
        and(
          eq(habits.userId, session.user.id),
          isNotNull(habits.lastCompleted)
        )
      )
      .groupBy(sql`DATE(${habits.lastCompleted})`);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("STATS_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}