import type { Sign } from "./types";

// Orden zodiacal desde 0° Aries. Sectores de 30°.
export const SIGNS: readonly Sign[] = [
  "Aries",
  "Tauro",
  "Géminis",
  "Cáncer",
  "Leo",
  "Virgo",
  "Libra",
  "Escorpio",
  "Sagitario",
  "Capricornio",
  "Acuario",
  "Piscis",
] as const;

/** Normaliza un angulo en grados a [0,360). */
export function normalizeLongitude(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Longitud eclíptica -> signo y grado dentro del signo. */
export function signFromLongitude(longitude: number): {
  sign: Sign;
  degreeInSign: number;
} {
  const lon = normalizeLongitude(longitude);
  const index = Math.floor(lon / 30) % 12;
  return { sign: SIGNS[index], degreeInSign: lon - index * 30 };
}
