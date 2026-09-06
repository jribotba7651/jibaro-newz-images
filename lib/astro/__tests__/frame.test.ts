import { describe, it, expect } from "vitest";
import {
  Body as AeBody,
  GeoVector,
  RotateVector,
  Rotation_EQJ_ECL,
} from "astronomy-engine";
import { eclipticLongitudeOfDate } from "../positions";
import { signFromLongitude, normalizeLongitude } from "../signs";

// Helper SOLO de test: longitud eclíptica geocéntrica en el marco J2000 (ECL, equinoccio medio
// de J2000), para contrastar contra el marco de fecha del motor. Rota el vector EQJ de GeoVector
// con Rotation_EQJ_ECL() (sin argumento de tiempo -> J2000) y saca atan2.
function eclipticLongitudeJ2000(body: AeBody, date: Date): number {
  const eqj = GeoVector(body, date, true);
  const v = RotateVector(Rotation_EQJ_ECL(), eqj);
  return normalizeLongitude((Math.atan2(v.y, v.x) * 180) / Math.PI);
}

describe("marco de coordenadas: tropical de fecha, NO J2000", () => {
  // Regla 1 de CLAUDE.md. Este es el eje del sistema.

  it("of-date difiere de J2000 por la precesión (~0.36° en 2026)", () => {
    const date = new Date("2026-06-15T12:00:00Z");
    const ofDate = eclipticLongitudeOfDate("Sol", date);
    const j2000 = eclipticLongitudeJ2000(AeBody.Sun, date);
    let delta = ofDate - j2000;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    // Precesión J2000->2026.45 ≈ 50.29"/yr * 26.45 yr ≈ 0.37°.
    expect(delta).toBeGreaterThan(0.34);
    expect(delta).toBeLessThan(0.4);
  });

  it("en cúspide, el marco cambia el SIGNO (of-date correcto, J2000 mal)", () => {
    // Buscamos el instante en que el Sol (of-date) entra en Aries (long. 0) en 2026,
    // luego tomamos un momento DESPUÉS: como of-date va adelante de J2000 por la precesión
    // (~0.37° en 2026), el Sol of-date ya está en Aries mientras J2000 todavía dice Piscis.
    const cross = findSunAriesIngress2026();
    const t = new Date(cross.getTime() + 6 * 3600 * 1000); // 6h despues del ingreso of-date

    const ofDateSign = signFromLongitude(eclipticLongitudeOfDate("Sol", t)).sign;
    const j2000Sign = signFromLongitude(
      eclipticLongitudeJ2000(AeBody.Sun, t),
    ).sign;

    expect(ofDateSign).toBe("Aries"); // marco de fecha: correcto (signo tropical real)
    expect(j2000Sign).toBe("Piscis"); // marco J2000: rezagado, equivocado en cúspide
    expect(ofDateSign).not.toBe(j2000Sign); // el marco importa
  });
});

// Binary search del cruce of-date del Sol por 0° (entrada a Aries / equinoccio de marzo) en 2026.
function findSunAriesIngress2026(): Date {
  let lo = new Date("2026-03-18T00:00:00Z").getTime();
  let hi = new Date("2026-03-22T00:00:00Z").getTime();
  // f = distancia con signo a 0°, en (-180,180]; negativa justo antes (Piscis ~359),
  // positiva justo despues (Aries ~0.x).
  const f = (t: number) => {
    let d = normalizeLongitude(eclipticLongitudeOfDate("Sol", new Date(t)));
    if (d > 180) d -= 360;
    return d;
  };
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) < 0) lo = mid;
    else hi = mid;
  }
  return new Date((lo + hi) / 2);
}
