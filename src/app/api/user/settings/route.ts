import { db } from "@/lib/db";
import { users } from "@/db/schema/schema";
import { eq, and, ne } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, username } = await req.json();

    // 1. Cek apakah username sudah dipakai orang lain
    if (username) {
      const existingUser = await db.query.users.findFirst({
        where: and(
          eq(users.username, username),
          ne(users.id, session.user.id) // Bukan milik kita sendiri
        ),
      });

      if (existingUser) {
        return NextResponse.json({ error: "Username sudah digunakan" }, { status: 400 });
      }
    }

    // 2. Update data ke database
    await db
      .update(users)
      .set({
        name: name,
        username: username,
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}