import { db } from "@/lib/db";
import { communities, guildQuests } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guildId = parseInt(id);

  try {
    const guild = await db.query.communities.findFirst({
      where: eq(communities.id, guildId),
    });

    const quests = await db.query.guildQuests.findMany({
      where: eq(guildQuests.communityId, guildId),
    });

    return NextResponse.json({ guild, quests });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}