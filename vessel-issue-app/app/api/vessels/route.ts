import { NextRequest, NextResponse } from "next/server";
import { withRole } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const vesselSchema = z.object({
  name: z.string().min(1),
  imo: z.string().min(1),
  flag: z.string().min(1),
  type: z.string().min(1),
  lastInspectionDate: z.string(),
  assignedToUserId: z.string().optional().nullable(),
});

async function handler(req: NextRequest, user: any) {
  if (req.method === "GET") {
    const vessels = await prisma.vessel.findMany({
      include: {
        issues: {
          where: { status: "OPEN" },
        },
        assignedToUser: {
          select: { id: true, email: true },
        },
      },
    });

    return NextResponse.json({ vessels });
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      const data = vesselSchema.parse(body);

      const { assignedToUserId, ...rest } = data;
      const vessel = await prisma.vessel.create({
        data: {
          ...rest,
          assignedToUserId: assignedToUserId || null,
          lastInspectionDate: new Date(rest.lastInspectionDate),
        },
        include: {
          assignedToUser: {
            select: { id: true, email: true },
          },
        },
      });

      return NextResponse.json({ vessel }, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export const GET = withRole("ADMIN")(handler);
export const POST = withRole("ADMIN")(handler);
