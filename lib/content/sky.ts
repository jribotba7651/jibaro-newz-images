import type { Body, ChartSnapshot, Sign } from "../astro/types";
import type { SignAspect, SkySummary } from "./types";
import { ZODIAC_ORDER } from "./profiles";

function positionSign(snapshot: ChartSnapshot, body: Body): Sign {
  const pos = snapshot.positions.find((p) => p.body === body);
  if (!pos) throw new Error(`Falta ${body} en el snapshot`);
  return pos.sign;
}

function isRetro(snapshot: ChartSnapshot, body: Body): boolean {
  const pos = snapshot.positions.find((p) => p.body === body);
  return pos?.retrograde ?? false;
}

/** Resume el cielo de un ChartSnapshot para la capa de contenido. */
export function summarizeSky(snapshot: ChartSnapshot): SkySummary {
  const slowBodies: Body[] = [
    "Júpiter",
    "Saturno",
    "Urano",
    "Neptuno",
    "Plutón",
  ];
  return {
    date: snapshot.date,
    sunSign: positionSign(snapshot, "Sol"),
    moonSign: positionSign(snapshot, "Luna"),
    moonPhaseName: snapshot.moon.phaseName,
    illumination: snapshot.moon.illumination,
    mercuryRetrograde: isRetro(snapshot, "Mercurio"),
    slow: slowBodies.map((body) => ({
      body,
      sign: positionSign(snapshot, body),
      retrograde: isRetro(snapshot, body),
    })),
    northNodeSign: positionSign(snapshot, "NodoNorte"),
    southNodeSign: positionSign(snapshot, "NodoSur"),
  };
}

const signIndex = (sign: Sign): number => ZODIAC_ORDER.indexOf(sign);

/**
 * Relación por signo (grueso, no por grado) entre dos signos.
 * 0 conjunción, 2/10 sextil, 3/9 cuadratura, 4/8 trígono, 6 oposición, resto tensión menor.
 */
export function signAspect(from: Sign, to: Sign): SignAspect {
  const steps = (signIndex(to) - signIndex(from) + 12) % 12;
  switch (steps) {
    case 0:
      return "conjunción";
    case 2:
    case 10:
      return "sextil";
    case 3:
    case 9:
      return "cuadratura";
    case 4:
    case 8:
      return "trígono";
    case 6:
      return "oposición";
    default:
      return "tensión menor";
  }
}
