import { db } from "@/lib/db";
import { users } from "@/db/schema/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const topUsers = await db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
        xp: users.xp,
        level: users.level,
      })
      .from(users)
      .orderBy(desc(users.xp))
      .limit(10); // Ambil top 10 saja

    return NextResponse.json(topUsers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}