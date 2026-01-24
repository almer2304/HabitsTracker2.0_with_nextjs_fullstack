import { db } from "@/lib/db";
import { habits, users, badges, userBadges } from "@/db/schema/schema";
import { eq, sql, and, isNotNull } from "drizzle-orm";
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
      return NextResponse.json({ error: "Quest sudah selesai hari ini!" }, { status: 400 });
    }

    // DEKLARASI DI LUAR TRANSACTION AGAR BISA DIAKSES OLEH RETURN
    const newlyEarnedBadges: any[] = [];

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

      // 4. AMBIL DATA UNTUK LOGIKA BADGE SPESIFIK
      // Hitung total misi yang pernah diselesaikan
      const totalCompletedQuests = await tx
        .select({ count: sql<number>`count(*)::int` })
        .from(habits)
        .where(and(eq(habits.userId, userId), isNotNull(habits.lastCompleted)));

      // Hitung misi berdasarkan kategori (Coding, Health, Learning)
      const questsByCategory = await tx
        .select({ 
          category: habits.category, 
          count: sql<number>`count(*)::int` 
        })
        .from(habits)
        .where(and(eq(habits.userId, userId), isNotNull(habits.lastCompleted)))
        .groupBy(habits.category);

      // Ambil habit dengan streak tertinggi milik user
      const maxStreakRow = await tx
        .select({ maxStreak: sql<number>`max(${habits.currentStreak})::int` })
        .from(habits)
        .where(eq(habits.userId, userId));

      const highestStreak = maxStreakRow[0].maxStreak || 0;
      const totalQuestsCount = totalCompletedQuests[0].count || 0;

      // 5. LOGIKA PEMBERIAN BADGE OTOMATIS
      const allBadges = await tx.select().from(badges);
      const myBadges = await tx.select().from(userBadges).where(eq(userBadges.userId, userId));

      for (const badge of allBadges) {
        const alreadyOwned = myBadges.some(mb => mb.badgeId === badge.id);
        if (alreadyOwned) continue;

        let isEligible = false;

        // Cek syarat berdasarkan nama badge di database
        switch (badge.name) {
          case "Tester Badge":
            if (currentTotalXp >= 120) isEligible = true; // Langsung dapat jika XP > 1
            break;
          case "First Step":
            if (totalQuestsCount >= 1) isEligible = true;
            break;
          case "Consistent Hero":
          case "Steady Progress":
          case "The Disciplined":
          case "Godlike Streak":
            if (highestStreak >= badge.requirement) isEligible = true;
            break;
          case "XP Titan":
          case "Silver Rank":
          case "Gold Rank":
          case "Mythical Hero":
            if (currentTotalXp >= badge.requirement) isEligible = true;
            break;
          case "Veteran":
          case "Century Club":
          case "Initiate Hero":
            if (totalQuestsCount >= badge.requirement) isEligible = true;
            break;
          case "Cybermancer":
            const codingCount = questsByCategory.find(c => c.category?.toLowerCase() === 'coding')?.count || 0;
            if (codingCount >= badge.requirement) isEligible = true;
            break;
          case "Vitality Sage":
            const healthCount = questsByCategory.find(c => c.category?.toLowerCase() === 'health')?.count || 0;
            if (healthCount >= badge.requirement) isEligible = true;
            break;
          case "Scholar Architect":
            const learningCount = questsByCategory.find(c => c.category?.toLowerCase() === 'learning')?.count || 0;
            if (learningCount >= badge.requirement) isEligible = true;
            break;
          case "Weekend Warrior":
            const day = new Date().getDay();
            if (day === 0 || day === 6) isEligible = true;
            break;
          case "Brave Recruit":
            const joinedCount = await tx
              .select({ count: sql<number>`count(*)::int` })
              .from(communityMembers)
              .where(eq(communityMembers.userId, userId));
              
            if (joinedCount[0].count >= badge.requirement) isEligible = true;
            break;
        }

        if (isEligible) {
          await tx.insert(userBadges).values({
            userId: userId,
            badgeId: badge.id,
          });
          // Masukkan objek badge yang didapat ke array newlyEarnedBadges
          newlyEarnedBadges.push(badge);
        }
      }
    });

    // 6. Return response beserta data badge yang baru didapatkan
    return NextResponse.json({ 
      message: "Quest Complete! XP & Badges Updated", 
      newBadges: newlyEarnedBadges
    });

  } catch (error) {
    console.error("CHECKIN_ERROR:", error);
    return NextResponse.json({ error: "Gagal memproses check-in" }, { status: 500 });
  }
}