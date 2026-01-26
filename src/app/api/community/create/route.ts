import { db } from "@/lib/db";
import { communities } from "@/db/schema/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // 1. Ambil sesi user yang sedang login
  const session = await getServerSession(authOptions);
  
  // 2. Keamanan: Jika tidak login, jangan izinkan buat guild
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description } = await req.json();

    // 3. Simpan ke Database PostgreSQL
    await db.insert(communities).values({
      name,
      description,
      // Gunakan creatorId sesuai struktur tabel kamu
      creatorId: session.user.id, 
    });

    return NextResponse.json({ message: "Guild Berhasil Dibuat!" }, { status: 201 });
  } catch (error) {
    console.error("CREATE_GUILD_ERROR:", error);
    return NextResponse.json({ error: "Gagal membuat guild ke database" }, { status: 500 });
  }
}