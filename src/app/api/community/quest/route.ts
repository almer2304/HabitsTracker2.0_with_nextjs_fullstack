import { db } from "@/lib/db";
import { communities, guildQuests } from "@/db/schema/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  // 1. Cek apakah user sudah login
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { communityId, title, description, xpReward } = await req.json();

    // 2. VALIDASI: Pastikan yang membuat quest adalah Leader (Creator) Guild tersebut
    const guild = await db.query.communities.findFirst({
      where: and(
        eq(communities.id, communityId),
        eq(communities.creatorId, session.user.id) // Memastikan creatorId cocok dengan ID login
      ),
    });

    if (!guild) {
      return NextResponse.json({ error: "Hanya Guild Master yang bisa mengirim Quest!" }, { status: 403 });
    }

    // 3. Insert Quest ke database
    await db.insert(guildQuests).values({
      communityId,
      title,
      description,
      xpReward: parseInt(xpReward),
      creatorId: session.user.id 
    });

    return NextResponse.json({ message: "Guild Quest Dispatched!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengirim quest" }, { status: 500 });
  }
}