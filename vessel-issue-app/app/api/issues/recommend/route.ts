import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

// Simple in-memory cache
const cache = new Map<string, { data: any; expires: number }>();

async function handler(req: NextRequest, user: any) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const vesselType = searchParams.get("vesselType");

  if (!category && !vesselType) {
    return NextResponse.json(
      { error: "Category or vessel type required" },
      { status: 400 }
    );
  }

  const cacheKey = `recommendations:${category || ""}:${vesselType || ""}`;
  const cached = cache.get(cacheKey);

  // Check if cache is still valid (5 minutes TTL)
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json({ recommendations: cached.data });
  }

  try {
    let whereClause: any = {
      status: "RESOLVED",
    };

    if (category && vesselType) {
      whereClause = {
        AND: [
          { status: "RESOLVED" },
          {
            OR: [{ category }, { vessel: { type: vesselType } }],
          },
        ],
      };
    } else if (category) {
      whereClause.category = category;
    } else if (vesselType) {
      whereClause.vessel = { type: vesselType };
    }

    const recommendations = await prisma.issue.findMany({
      where: whereClause,
      include: {
        vessel: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // Cache the results for 5 minutes
    cache.set(cacheKey, {
      data: recommendations,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);



