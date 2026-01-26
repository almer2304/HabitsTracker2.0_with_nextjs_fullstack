import { db } from "@/lib/db";
import { guildMessages, users } from "@/db/schema/schema";
import { eq, asc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// AMBIL PESAN (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const communityId = searchParams.get("communityId");

  if (!communityId) return NextResponse.json({ error: "ID Missing" }, { status: 400 });

  try {
    const messages = await db.query.guildMessages.findMany({
      where: eq(guildMessages.communityId, parseInt(communityId)),
      with: {
        user: true, // Pastikan di db/index.ts kamu sudah mendefinisikan relations, jika belum gunakan join manual di bawah:
      },
      orderBy: [asc(guildMessages.createdAt)],
    });

    // Jika belum setting relations di drizzle, gunakan ini:
    const manualMessages = await db
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

    return NextResponse.json(manualMessages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

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