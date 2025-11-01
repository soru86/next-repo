import { NextRequest, NextResponse } from "next/server";
import { withRole } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

async function handler(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const users = await prisma.user.findMany({
    where: { role: "CREW" },
    select: { id: true, email: true },
    orderBy: { email: "asc" },
  });

  return NextResponse.json({ users });
}

export const GET = withRole("ADMIN")(handler);

