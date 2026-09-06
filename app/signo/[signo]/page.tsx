import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildChartSnapshot } from "@/lib/astro";
import { generateHoroscope, slugToSign } from "@/lib/content";

export const dynamic = "force-dynamic";

type Params = { signo: string };

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { signo } = await params;
  const sign = slugToSign(signo);
  if (!sign) return { title: "Signo no encontrado · Jíbaro Newz" };

  const h = generateHoroscope(buildChartSnapshot(new Date()), sign);
  const ogUrl = `/api/og?signo=${signo}&date=${todayISO()}`;
  const title = `${sign} · Jíbaro Newz`;
  const description = h.body.slice(0, 180);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: ogUrl, width: 1200, height: 630, alt: `${sign} hoy` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default async function SignoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { signo } = await params;
  const sign = slugToSign(signo);
  if (!sign) notFound();

  const snapshot = buildChartSnapshot(new Date());
  const h = generateHoroscope(snapshot, sign);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← Todos los signos
      </Link>

      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-700">
          Jíbaro Newz
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{h.title}</h1>
        <p className="text-sm text-neutral-500">
          {h.element} {h.modality} · regente {h.ruler}
        </p>
      </header>

      <article className="text-lg leading-relaxed text-neutral-800">
        {h.body}
      </article>

      <footer className="mt-4 border-t border-neutral-200 pt-4 text-sm text-neutral-500">
        <p>{h.transitFocus}.</p>
        {h.draft ? (
          <p className="mt-2 text-amber-700">
            Borrador: registro literario pendiente de la guía de voz del
            proyecto.
          </p>
        ) : null}
      </footer>
    </main>
  );
}
