import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Temporarily disabled for testing - allows access to all dashboards
  // TODO: Re-enable when cookie authentication is properly implemented
  return NextResponse.next();
}
