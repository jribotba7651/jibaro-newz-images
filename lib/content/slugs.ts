import type { Sign } from "../astro/types";
import { ZODIAC_ORDER } from "./profiles";

// Slugs ASCII para URLs (sin acentos). Mapeo estable signo <-> slug.
export const SIGN_SLUGS: Record<Sign, string> = {
  Aries: "aries",
  Tauro: "tauro",
  Géminis: "geminis",
  Cáncer: "cancer",
  Leo: "leo",
  Virgo: "virgo",
  Libra: "libra",
  Escorpio: "escorpio",
  Sagitario: "sagitario",
  Capricornio: "capricornio",
  Acuario: "acuario",
  Piscis: "piscis",
};

const SLUG_TO_SIGN: Record<string, Sign> = Object.fromEntries(
  Object.entries(SIGN_SLUGS).map(([sign, slug]) => [slug, sign as Sign]),
) as Record<string, Sign>;

export function signToSlug(sign: Sign): string {
  return SIGN_SLUGS[sign];
}

export function slugToSign(slug: string): Sign | null {
  return SLUG_TO_SIGN[slug.toLowerCase()] ?? null;
}

export const ALL_SLUGS: string[] = ZODIAC_ORDER.map((s) => SIGN_SLUGS[s]);
