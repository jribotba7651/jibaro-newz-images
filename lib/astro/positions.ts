import {
  Body as AeBody,
  GeoVector,
  Ecliptic,
  SunPosition,
  EclipticGeoMoon,
} from "astronomy-engine";
import type { PhysicalBody, SignPosition } from "./types";
import { signFromLongitude, normalizeLongitude } from "./signs";

// Mapa de nombres del proyecto (español) al enum de astronomy-engine.
const BODY_MAP: Record<PhysicalBody, AeBody> = {
  Sol: AeBody.Sun,
  Luna: AeBody.Moon,
  Mercurio: AeBody.Mercury,
  Venus: AeBody.Venus,
  Marte: AeBody.Mars,
  Júpiter: AeBody.Jupiter,
  Saturno: AeBody.Saturn,
  Urano: AeBody.Uranus,
  Neptuno: AeBody.Neptune,
  Plutón: AeBody.Pluto,
};

export const PHYSICAL_BODIES: readonly PhysicalBody[] = [
  "Sol",
  "Luna",
  "Mercurio",
  "Venus",
  "Marte",
  "Júpiter",
  "Saturno",
  "Urano",
  "Neptuno",
  "Plutón",
] as const;

// Longitud eclíptica geocéntrica, equinoccio VERDADERO de fecha (tropical de fecha).
//
// Confirmado leyendo los tipos de astronomy-engine 2.1.19 (no de memoria):
//   - Sol:   SunPosition(date)  -> "apparent geocentric true ecliptic coordinates of date".
//   - Luna:  EclipticGeoMoon(date).lon -> Spherical en marco ECT (true ecliptic of date).
//   - resto: Ecliptic(GeoVector(body,date,true)).elon. El Vector devuelto por GeoVector lleva
//            su AstroTime en .t, y en 2.1.19 Ecliptic() convierte a "true ecliptic of date (ECT)".
//
// IMPORTANTE: NO usar EclipticLongitude(): su doc dice "heliocentric ecliptic longitude".
// Es heliocéntrica, no geocéntrica; daria posiciones equivocadas para el zodiaco visto de la Tierra.
export function eclipticLongitudeOfDate(body: PhysicalBody, date: Date): number {
  const ae = BODY_MAP[body];
  if (ae === AeBody.Sun) return normalizeLongitude(SunPosition(date).elon);
  if (ae === AeBody.Moon) return normalizeLongitude(EclipticGeoMoon(date).lon);
  return normalizeLongitude(Ecliptic(GeoVector(ae, date, true)).elon);
}

// Por contrato, Sol y Luna nunca se marcan retrógrados (los nodos se manejan en node.ts).
const NEVER_RETROGRADE = new Set<PhysicalBody>(["Sol", "Luna"]);

/**
 * Retrogradación por diferencia finita de la longitud eclíptica de fecha.
 * Compara la longitud en date-12h vs date+12h, desenrollando el cruce 0/360.
 * Δlon < 0 (movimiento en sentido de las longitudes decrecientes) = retrógrado.
 */
export function isRetrograde(body: PhysicalBody, date: Date): boolean {
  if (NEVER_RETROGRADE.has(body)) return false;
  const dtMs = 12 * 3600 * 1000;
  const before = eclipticLongitudeOfDate(body, new Date(date.getTime() - dtMs));
  const after = eclipticLongitudeOfDate(body, new Date(date.getTime() + dtMs));
  let delta = after - before;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta < 0;
}

/** Posición de signo para un cuerpo físico (Sol a Plutón). */
export function physicalPosition(body: PhysicalBody, date: Date): SignPosition {
  const longitude = eclipticLongitudeOfDate(body, date);
  const { sign, degreeInSign } = signFromLongitude(longitude);
  return {
    body,
    longitude,
    sign,
    degreeInSign,
    retrograde: isRetrograde(body, date),
  };
}
