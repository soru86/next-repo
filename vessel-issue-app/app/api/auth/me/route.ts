import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

async function handler(req: NextRequest, user: any) {
  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: {
      id: true,
      email: true,
      role: true,
      assignedVesselIds: true,
    },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: dbUser });
}

export const GET = withAuth(handler);
