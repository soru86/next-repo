import { NextRequest, NextResponse } from "next/server";
import { withRole } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

async function handler(req: NextRequest, user: any) {
  try {
    // Get all vessels with their open issues count
    const vessels = await prisma.vessel.findMany({
      include: {
        issues: {
          where: { status: "OPEN" },
        },
      },
    });

    // Update vessel statuses based on open issues count
    const updates = vessels.map(async (vessel: any) => {
      const openIssuesCount = vessel.issues.length;
      const newStatus = openIssuesCount >= 3 ? "UNDER_MAINTENANCE" : "ACTIVE";

      if (vessel.status !== newStatus) {
        return prisma.vessel.update({
          where: { id: vessel.id },
          data: { status: newStatus },
        });
      }
      return vessel;
    });

    await Promise.all(updates);

    return NextResponse.json({
      message: "Maintenance scan completed",
      updatedVessels: vessels.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withRole("ADMIN")(handler);
