import { db } from "@/lib/db";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, username } = await req.json();

    // 1. Update ke database
    const updatedUser = await db.update(users)
      .set({ name, username })
      .where(eq(users.id, session.user.id))
      .returning(); // Mengambil data yang baru saja diupdate

    if (!updatedUser[0]) throw new Error("User not found");

    // 2. Kembalikan data terbaru agar frontend bisa langsung update state
    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update database" }, { status: 500 });
  }
}