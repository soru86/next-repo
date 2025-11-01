import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function withAuth(
  handler: (req: NextRequest, user: any, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return handler(req, user, context);
  };
}

export function withRole(requiredRole: "ADMIN" | "CREW") {
  return function (
    handler: (req: NextRequest, user: any, context?: any) => Promise<NextResponse>
  ) {
    return withAuth(async (req: NextRequest, user: any, context?: any) => {
      if (user.role !== requiredRole) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        );
      }
      return handler(req, user, context);
    });
  };
}
