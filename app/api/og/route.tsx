import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { buildChartSnapshot } from "@/lib/astro";
import { generateHoroscope, summarizeSky, slugToSign } from "@/lib/content";
import { parseDateParam } from "@/lib/date";

export const dynamic = "force-dynamic";

const SIZE = { width: 1200, height: 630 };

const GLYPH: Record<string, string> = {
  Aries: "♈",
  Tauro: "♉",
  Géminis: "♊",
  Cáncer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Escorpio: "♏",
  Sagitario: "♐",
  Capricornio: "♑",
  Acuario: "♒",
  Piscis: "♓",
};

// GET /api/og?signo=aries&date=2026-09-06 -> imagen OG 1200x630
export function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const { date } = parseDateParam(params.get("date"));
  const snapshot = buildChartSnapshot(date);
  const sky = summarizeSky(snapshot);
  const fecha = snapshot.date.slice(0, 10);

  const sign = slugToSign(params.get("signo") ?? "");
  const heading = sign ?? "Tarot Boricua";
  const glyph = sign ? GLYPH[sign] : "✷";
  const focus = sign
    ? generateHoroscope(snapshot, sign).transitFocus
    : `Sol en ${sky.sunSign} · ${sky.moonPhaseName} en ${sky.moonSign}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "radial-gradient(1200px 630px at 78% 18%, #2a2350 0%, #14112b 55%, #0b0a1a 100%)",
          color: "#f5f0e6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 30, letterSpacing: 6, color: "#c8b98f", textTransform: "uppercase" }}>
            Tarot Boricua
          </div>
          <div style={{ fontSize: 30, color: "#9b93c4" }}>{fecha}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ fontSize: 200, lineHeight: 1, color: "#e8c766" }}>{glyph}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>{heading}</div>
            <div style={{ fontSize: 40, color: "#b9b2dd", marginTop: 8 }}>
              {sign ? `Temporada de ${sky.sunSign}` : "El cielo de hoy"}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#d8d2ee",
            borderTop: "1px solid rgba(200,185,143,0.35)",
            paddingTop: 24,
            lineHeight: 1.3,
          }}
        >
          {focus}
        </div>
      </div>
    ),
    SIZE,
  );
}
