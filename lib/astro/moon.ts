import { MoonPhase, Illumination, Body as AeBody } from "astronomy-engine";
import type { MoonInfo } from "./types";
import { normalizeLongitude } from "./signs";

/**
 * Nombre de fase en español a partir del ángulo de fase [0,360).
 * El ángulo es la elongación eclíptica Luna-Sol: 0 nueva, 90 cuarto creciente,
 * 180 llena, 270 cuarto menguante. Ocho sectores de 45° centrados en los puntos clave.
 */
export function phaseName(angle: number): string {
  const a = normalizeLongitude(angle);
  if (a < 22.5 || a >= 337.5) return "Luna nueva";
  if (a < 67.5) return "Luna creciente";
  if (a < 112.5) return "Cuarto creciente";
  if (a < 157.5) return "Gibosa creciente";
  if (a < 202.5) return "Luna llena";
  if (a < 247.5) return "Gibosa menguante";
  if (a < 292.5) return "Cuarto menguante";
  return "Luna menguante";
}

export function moonInfo(date: Date): MoonInfo {
  const phaseAngle = MoonPhase(date);
  const illumination = Illumination(AeBody.Moon, date).phase_fraction;
  return { phaseAngle, phaseName: phaseName(phaseAngle), illumination };
}
