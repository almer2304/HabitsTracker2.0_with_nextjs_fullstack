import { db } from "@/lib/db";
import { habits, users } from "@/db/schema/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { eq, sql, and } from "drizzle-orm";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Simpan ke variabel agar TypeScript tenang
  const userId = session.user.id;
  try {
    const { habitId, xpGain } = await req.json();

    // 1. Ambil data habit untuk cek status terakhir
    const habitData = await db.query.habits.findFirst({
      where: and(eq(habits.id, habitId), eq(habits.userId, session.user.id)),
    });

    if (!habitData) return NextResponse.json({ error: "Habit tidak ditemukan" }, { status: 404 });

    // 2. LOGIKA ANTI-CHEAT (Hanya 1x Sehari)
    const today = new Date().toDateString();
    const lastCheck = habitData.lastCompleted ? new Date(habitData.lastCompleted).toDateString() : null;

    if (today === lastCheck) {
      return NextResponse.json({ error: "Quest sudah selesai untuk hari ini!" }, { status: 400 });
    }

    // 3. TRANSACTION (Update Streak & XP secara bersamaan)
    await db.transaction(async (tx) => {
      // Update Streak di tabel Habit
      await tx.update(habits)
        .set({ 
          currentStreak: (habitData.currentStreak || 0) + 1,
          lastCompleted: new Date() 
        })
        .where(eq(habits.id, habitId));

      // Update XP di tabel User
      await tx.update(users)
        .set({ xp: sql`${users.xp} + ${xpGain}` })
        .where(eq(users.id, userId));
    });

    return NextResponse.json({ message: "Quest Complete! XP Gained" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memproses check-in" }, { status: 500 });
  }
}