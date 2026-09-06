import { NextResponse, type NextRequest } from "next/server";
import { buildChartSnapshot } from "@/lib/astro";
import { generateHoroscope, generateHoroscopeSet, slugToSign } from "@/lib/content";
import { parseDateParam } from "@/lib/date";

export const dynamic = "force-dynamic";

// GET /api/horoscope?date=2026-09-06            -> HoroscopeSet (12 signos)
// GET /api/horoscope?date=2026-09-06&signo=aries -> Horoscope (un signo)
export function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const { date, error } = parseDateParam(params.get("date"));
  if (error) return NextResponse.json({ error }, { status: 400 });

  const snapshot = buildChartSnapshot(date);
  const signoParam = params.get("signo");

  if (signoParam) {
    const sign = slugToSign(signoParam);
    if (!sign) {
      return NextResponse.json(
        { error: `Signo desconocido: "${signoParam}"` },
        { status: 400 },
      );
    }
    return NextResponse.json(generateHoroscope(snapshot, sign));
  }

  return NextResponse.json(generateHoroscopeSet(snapshot));
}
