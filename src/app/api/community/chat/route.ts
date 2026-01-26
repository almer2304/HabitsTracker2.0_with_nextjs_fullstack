import { db } from "@/lib/db";
import { guildMessages, users } from "@/db/schema/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";   

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const communityId = searchParams.get("communityId");

  if (!communityId) return NextResponse.json({ error: "ID Missing" }, { status: 400 });

  try {
    // Gunakan Select Join untuk menghindari error relasi undefined
    const messages = await db
      .select({
        id: guildMessages.id,
        content: guildMessages.content,
        createdAt: guildMessages.createdAt,
        user: {
          name: users.name,
          image: users.image,
        },
      })
      .from(guildMessages)
      .leftJoin(users, eq(guildMessages.userId, users.id))
      .where(eq(guildMessages.communityId, parseInt(communityId)))
      .orderBy(asc(guildMessages.createdAt));

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Chat GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST tetap sama seperti sebelumnya karena sudah berhasil (200)

// KIRIM PESAN (POST)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { communityId, content } = await req.json();
    const newMessage = await db.insert(guildMessages).values({
      communityId: parseInt(communityId),
      userId: session.user.id,
      content,
    }).returning();

    return NextResponse.json(newMessage[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}