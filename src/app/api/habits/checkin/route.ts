import { db } from "@/lib/db";
import { habits, users, badges, userBadges } from "@/db/schema/schema";
import { eq, sql, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  // 1. Validasi Session & User ID
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { habitId, xpGain } = await req.json();

    // Ambil data habit untuk pengecekan
    const habitData = await db.query.habits.findFirst({
      where: eq(habits.id, habitId),
    });

    if (!habitData) {
      return NextResponse.json({ error: "Habit tidak ditemukan" }, { status: 404 });
    }

    // 2. LOGIKA ANTI-CHEAT (Hanya 1x Sehari)
    const today = new Date().toDateString();
    const lastCheck = habitData.lastCompleted 
      ? new Date(habitData.lastCompleted).toDateString() 
      : null;

    if (today === lastCheck) {
      return NextResponse.json(
        { error: "Quest sudah selesai untuk hari ini!" }, 
        { status: 400 }
      );
    }

    // 3. TRANSACTION: Update Streak, XP, dan Cek Badges secara bersamaan
    await db.transaction(async (tx) => {
      // Update Streak & LastCompleted di tabel Habit
      await tx.update(habits)
        .set({
          currentStreak: (habitData.currentStreak || 0) + 1,
          lastCompleted: new Date(),
        })
        .where(eq(habits.id, habitId));

      // Update Total XP di tabel User
      const updatedUser = await tx.update(users)
        .set({ xp: sql`${users.xp} + ${xpGain}` })
        .where(eq(users.id, userId))
        .returning();

      const currentTotalXp = updatedUser[0].xp || 0;
      const currentStreak = (habitData.currentStreak || 0) + 1;

      // 4. LOGIKA PEMBERIAN BADGE OTOMATIS
      // Ambil semua master badges
      const allBadges = await tx.select().from(badges);
      
      // Ambil badge yang sudah dimiliki user
      const myBadges = await tx.select()
        .from(userBadges)
        .where(eq(userBadges.userId, userId));

      for (const badge of allBadges) {
        const alreadyOwned = myBadges.some(mb => mb.badgeId === badge.id);

        if (!alreadyOwned) {
          let isEligible = false;

          // Cek berdasarkan Nama Badge & Requirement (integer)
          if (badge.name === "XP Titan" && currentTotalXp >= badge.requirement) {
            isEligible = true;
          } else if (badge.name === "Consistent Hero" && currentStreak >= badge.requirement) {
            isEligible = true;
          } else if (badge.name === "First Step" && currentTotalXp > 0) {
            isEligible = true;
          }

          if (isEligible) {
            await tx.insert(userBadges).values({
              userId: userId,
              badgeId: badge.id,
              earnedAt: new Date(),
            });
          }
        }
      }
    });

    return NextResponse.json({ message: "Quest Complete! XP & Badges Updated" });

  } catch (error) {
    console.error("CHECKIN_ERROR:", error);
    return NextResponse.json(
      { error: "Gagal memproses check-in" }, 
      { status: 500 }
    );
  }
}