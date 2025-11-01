import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

async function handler(req: NextRequest, user: any) {
  const vessels = await prisma.vessel.findMany({
    where: {
      assignedToUserId: user.userId,
    },
    include: {
      issues: {
        where: { status: "OPEN" },
      },
    },
  });

  return NextResponse.json({ vessels });
}

export const GET = withAuth(handler);
