import Link from "next/link";
import { buildChartSnapshot } from "@/lib/astro";
import { summarizeSky, ZODIAC_ORDER, signToSlug } from "@/lib/content";

export const dynamic = "force-dynamic";

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

export default function Home() {
  const snapshot = buildChartSnapshot(new Date());
  const sky = summarizeSky(snapshot);
  const saturno = sky.slow.find((p) => p.body === "Saturno");

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-700">
          Tarot Boricua
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          El cielo de hoy
        </h1>
        <p className="text-lg leading-relaxed text-neutral-600">
          Sol en {sky.sunSign}, {sky.moonPhaseName.toLowerCase()} en{" "}
          {sky.moonSign}
          {saturno ? `, Saturno en ${saturno.sign}` : ""}. Escoge tu signo.
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ZODIAC_ORDER.map((sign) => (
          <li key={sign}>
            <Link
              href={`/signo/${signToSlug(sign)}`}
              className="flex items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3 transition hover:border-amber-400 hover:bg-amber-50"
            >
              <span className="text-2xl text-amber-600">{GLYPH[sign]}</span>
              <span className="font-medium">{sign}</span>
            </Link>
          </li>
        ))}
      </ul>

      <footer className="border-t border-neutral-200 pt-4 text-sm text-neutral-500">
        <p>
          API: <code>/api/chart</code>, <code>/api/horoscope</code>,{" "}
          <code>/api/og</code> (aceptan <code>?date=</code>).
        </p>
      </footer>
    </main>
  );
}
