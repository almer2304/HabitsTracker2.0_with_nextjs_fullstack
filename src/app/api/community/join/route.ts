import { db } from "@/lib/db";
import { communityMembers } from "@/db/schema/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { communityId } = await req.json();

    // Masukkan user ke tabel member
    await db.insert(communityMembers).values({
      communityId: communityId,
      userId: session.user.id,
    });

    return NextResponse.json({ message: "Successfully joined the guild!" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to join community" }, { status: 500 });
  }
}