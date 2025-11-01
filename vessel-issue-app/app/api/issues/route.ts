import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const issueSchema = z.object({
  vesselId: z.string(),
  category: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

async function handler(req: NextRequest, user: any) {
  const assignedVesselIds = user.assignedVesselIds
    ? JSON.parse(user.assignedVesselIds)
    : [];

  if (req.method === "GET") {
    const issues = await prisma.issue.findMany({
      where: {
        vessel: {
          assignedToUserId: user.userId,
        },
      },
      include: {
        vessel: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ issues });
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      const data = issueSchema.parse(body);

      // Check if vessel is assigned to user (via relation)
      const allowed = await prisma.vessel.findFirst({
        where: { id: data.vesselId, assignedToUserId: user.userId },
        select: { id: true },
      });
      if (!allowed) {
        return NextResponse.json(
          { error: "Vessel not assigned to you" },
          { status: 403 }
        );
      }

      // Check if vessel has more than 3 open issues
      const openIssuesCount = await prisma.issue.count({
        where: {
          vesselId: data.vesselId,
          status: "OPEN",
        },
      });

      if (openIssuesCount >= 3) {
        return NextResponse.json(
          { error: "Vessel cannot have more than 3 open issues" },
          { status: 400 }
        );
      }

      const issue = await prisma.issue.create({
        data: {
          ...data,
          priority: data.priority || "MEDIUM",
        },
        include: {
          vessel: true,
        },
      });

      return NextResponse.json({ issue }, { status: 201 });
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

export const GET = withAuth(handler);
export const POST = withAuth(handler);
