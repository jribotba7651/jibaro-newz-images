import type { ChartSnapshot, Sign } from "../astro/types";
import type { Horoscope, HoroscopeSet, SkySummary } from "./types";
import { SIGN_PROFILES, ZODIAC_ORDER } from "./profiles";
import { summarizeSky, signAspect } from "./sky";
import {
  PHASE_VOICE,
  SATURN_ASPECT_VOICE,
  MERCURY_RETRO_NOTE,
  ELEMENT_CLOSING,
} from "./voice";

const VOICE_GUIDE_NOTE =
  "Registro en BORRADOR: faltan biblia-traduccion.md y glosario-de-consistencia.md. " +
  "El texto es determinista y sirve de andamio; el registro literario definitivo espera la guía de voz del proyecto.";

function phaseLine(sky: SkySummary): string {
  const clima = PHASE_VOICE[sky.moonPhaseName] ?? "el cielo sigue su curso";
  return `El Sol transita ${sky.sunSign} y hay ${sky.moonPhaseName.toLowerCase()} en ${sky.moonSign}: ${clima}.`;
}

/** Genera el horóscopo de un signo a partir del cielo del snapshot. Determinista. */
export function generateHoroscope(
  snapshot: ChartSnapshot,
  sign: Sign,
): Horoscope {
  const sky = summarizeSky(snapshot);
  const profile = SIGN_PROFILES[sign];

  const saturn = sky.slow.find((p) => p.body === "Saturno");
  if (!saturn) throw new Error("Falta Saturno en el resumen del cielo");
  const aspect = signAspect(sign, saturn.sign);
  const saturnLine = SATURN_ASPECT_VOICE[aspect];
  const retroNote = saturn.retrograde
    ? " Con Saturno retrógrado, la lección se repasa hacia adentro antes de seguir."
    : "";

  const transitFocus = `Saturno en ${saturn.sign}${
    saturn.retrograde ? " (retrógrado)" : ""
  }, en ${aspect} con ${sign}`;

  const identidad = `${sign}, signo de ${profile.element.toLowerCase()} ${profile.modality.toLowerCase()}: ${profile.esencia}.`;

  const mercurio = sky.mercuryRetrograde ? ` ${MERCURY_RETRO_NOTE}` : "";
  const cierre = ELEMENT_CLOSING[profile.element] ?? "";

  const body = [
    identidad,
    phaseLine(sky),
    `${saturnLine}${retroNote}`,
    mercurio.trim(),
    cierre,
  ]
    .filter((s) => s.length > 0)
    .join(" ");

  return {
    sign,
    element: profile.element,
    modality: profile.modality,
    ruler: String(profile.ruler),
    title: `${sign}: temporada de ${sky.sunSign}`,
    body,
    transitFocus,
    draft: true,
  };
}

/** Genera el set completo de los 12 signos para una fecha. Determinista. */
export function generateHoroscopeSet(snapshot: ChartSnapshot): HoroscopeSet {
  const sky = summarizeSky(snapshot);
  return {
    date: snapshot.date,
    sky,
    horoscopes: ZODIAC_ORDER.map((sign) => generateHoroscope(snapshot, sign)),
    draft: true,
    voiceGuideNote: VOICE_GUIDE_NOTE,
  };
}
