import { MakeTime } from "astronomy-engine";
import type { Body, SignPosition } from "./types";
import { signFromLongitude, normalizeLongitude } from "./signs";

/**
 * Longitud del nodo lunar ASCENDENTE medio.
 *
 * Fórmula de Meeus, "Astronomical Algorithms" 2ª ed., cap. 47, ecuación 47.7:
 *   Ω = 125.0445479 − 1934.1362891·T + 0.0020754·T² + T³/467441 − T⁴/60616000   (grados)
 * donde T = siglos julianos de Tiempo Terrestre (TT) desde J2000.0.
 *
 * Se usa MakeTime(date).tt (dias de TT desde J2000) / 36525 para obtener T en TT,
 * como pide Meeus. La diferencia TT-UTC (ΔT ≈ 69 s en 2026) es despreciable a nivel
 * de signo (el nodo medio se mueve ~0.053°/dia).
 *
 * El nodo medio ya está referido al equinoccio medio de fecha (marco tropical de fecha),
 * asi que no requiere rotación adicional.
 */
export function meanAscendingNodeLongitude(date: Date): number {
  const T = MakeTime(date).tt / 36525;
  const omega =
    125.0445479 -
    1934.1362891 * T +
    0.0020754 * T * T +
    (T * T * T) / 467441 -
    (T * T * T * T) / 60616000;
  return normalizeLongitude(omega);
}

/** Posiciones de NodoNorte (Ω) y NodoSur (Ω+180). Nunca retrógrados por contrato. */
export function nodePositions(date: Date): SignPosition[] {
  const north = meanAscendingNodeLongitude(date);
  const south = normalizeLongitude(north + 180);
  const make = (body: Body, longitude: number): SignPosition => {
    const { sign, degreeInSign } = signFromLongitude(longitude);
    return { body, longitude, sign, degreeInSign, retrograde: false };
  };
  return [make("NodoNorte", north), make("NodoSur", south)];
}
