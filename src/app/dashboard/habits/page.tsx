import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import Sidebar from "@/components/Sidebar";
import CreateHabitModal from "@/components/CreateHabitModal";
import HabitListClient from "@/components/HabitListClient"; // Client component untuk sorting

export default async function MyHabitsPage() {
  const session = await getServerSession(authOptions);
  const data = await db.select().from(habits).where(eq(habits.userId, session?.user?.id as string));

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100">
      <Sidebar />
      <main className="w-full md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter">MY QUESTS ⚔️</h1>
            <p className="text-slate-400">Manage and track your active habits.</p>
          </div>
          <CreateHabitModal />
        </header>

        {/* Komponen List yang bisa di-sort */}
        <HabitListClient initialData={data} />
      </main>
    </div>
  );
}