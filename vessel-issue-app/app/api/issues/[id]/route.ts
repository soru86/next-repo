import { NextRequest, NextResponse } from "next/server";
import { withRole } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateIssueSchema = z.object({
  status: z.enum(["OPEN", "RESOLVED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

async function handler(
  req: NextRequest,
  user: any,
  { params }: { params: { id: string } }
) {
  if (req.method === "PUT") {
    try {
      const body = await req.json();
      const data = updateIssueSchema.parse(body);

      const issue = await prisma.issue.update({
        where: { id: params.id },
        data,
        include: {
          vessel: true,
        },
      });

      return NextResponse.json({ issue });
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

export const PUT = withRole("ADMIN")(handler);



