import { db } from "@/lib/db";
import { habits } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import HabitListClient from "@/components/HabitListClient";
import CreateHabitModal from "@/components/CreateHabitModal";

export default async function MyHabitsPage() {
  const session = await getServerSession(authOptions);

  // Guard: Tendang ke login jika session tidak ada
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // Ambil data habit milik user ini
  const userHabits = await db
    .select()
    .from(habits)
    .where(eq(habits.userId, session.user.id));

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100">
      <Sidebar />
      
      <main className="w-full md:ml-64 p-6 md:p-10 pt-24 md:pt-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white">
              MY QUESTS <span className="text-blue-500">⚔️</span>
            </h1>
            <p className="text-slate-400 mt-1">Kelola dan selesaikan tantangan harianmu.</p>
          </div>
          <CreateHabitModal />
        </header>

        {/* Kirim data ke Client Component untuk interaksi */}
        <HabitListClient 
          initialData={userHabits} 
          userId={session.user.id} 
        />    
      </main>
    </div>
  );
}