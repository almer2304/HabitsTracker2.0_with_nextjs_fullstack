import { db } from "@/lib/db";
import { habits } from "@/db/schema/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

// POST: Membuat Quest/Habit Baru
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // Guard Clause: Harus Login
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, category, difficulty } = await req.json();

    const newHabit = await db.insert(habits).values({
      userId: session.user.id,
      title: title,
      category: category || "General",
      difficulty: difficulty || "Easy",
      currentStreak: 0,
    }).returning();

    return NextResponse.json(newHabit[0]);
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat habit" }, { status: 500 });
  }
}

// DELETE: Menghapus Quest
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!id) return NextResponse.json({ error: "ID dibutuhkan" }, { status: 400 });

  try {
    // Pastikan user hanya bisa hapus miliknya sendiri
    await db.delete(habits).where(
      and(
        eq(habits.id, parseInt(id)),
        eq(habits.userId, session.user.id)
      )
    );
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus" }, { status: 500 });
  }
}