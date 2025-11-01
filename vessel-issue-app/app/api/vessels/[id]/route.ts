import { NextRequest, NextResponse } from "next/server";
import { withRole } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateVesselSchema = z.object({
  name: z.string().min(1).optional(),
  imo: z.string().min(1).optional(),
  flag: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  lastInspectionDate: z.string().datetime().optional(),
});

async function handler(
  req: NextRequest,
  user: any,
  { params }: { params: { id: string } }
) {
  if (req.method === "GET") {
    const vessel = await prisma.vessel.findUnique({
      where: { id: params.id },
      include: {
        issues: true,
      },
    });

    if (!vessel) {
      return NextResponse.json({ error: "Vessel not found" }, { status: 404 });
    }

    return NextResponse.json({ vessel });
  }

  if (req.method === "PUT") {
    try {
      const body = await req.json();
      const data = updateVesselSchema.parse(body);

      const updateData: any = { ...data };
      if (data.lastInspectionDate) {
        updateData.lastInspectionDate = new Date(data.lastInspectionDate);
      }

      const vessel = await prisma.vessel.update({
        where: { id: params.id },
        data: updateData,
      });

      return NextResponse.json({ vessel });
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

  if (req.method === "DELETE") {
    await prisma.vessel.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export const GET = withRole("ADMIN")(handler);
export const PUT = withRole("ADMIN")(handler);
export const DELETE = withRole("ADMIN")(handler);



