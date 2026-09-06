import { NextResponse, type NextRequest } from "next/server";
import { buildChartSnapshot } from "@/lib/astro";
import { parseDateParam } from "@/lib/date";

export const dynamic = "force-dynamic";

// GET /api/chart?date=2026-09-06  -> ChartSnapshot (JSON)
export function GET(req: NextRequest) {
  const { date, error } = parseDateParam(req.nextUrl.searchParams.get("date"));
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json(buildChartSnapshot(date));
}
