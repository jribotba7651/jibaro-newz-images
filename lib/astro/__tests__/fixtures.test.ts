import { describe, it, expect } from "vitest";
import { eclipticLongitudeOfDate } from "../positions";
import { normalizeLongitude } from "../signs";

// Fixtures ancla de CLAUDE.md seccion 5: ingresos de Saturno 2023-2026.
//
// Procedencia: las fechas venian "de memoria" en el plan. Se confirmaron contra el propio
// astronomy-engine (validado a nivel de arcominuto contra JPL Horizons) haciendo búsqueda de
// raíz del cruce de cúspide. Las CUATRO coinciden al día con la memoria. Instantes calculados:
//   Piscis (cusp 330°):      2023-03-07T13:41 UTC
//   Aries 1er paso (cusp 0°): 2025-05-25T04:16 UTC
//   Retro a Piscis (cusp 0°): 2025-09-01T07:14 UTC
//   Aries reingreso (cusp 0°):2026-02-14T00:39 UTC
//
// Regla 2 de CLAUDE.md: si algo no cuadrara, se reporta, NO se ajusta el motor. Aqui no hubo
// discrepancia; el test recomputa el cruce y verifica que cae en la fecha de memoria.

// Distancia con signo (grados) de una longitud a un límite, en (-180,180].
function signedDistance(lon: number, boundary: number): number {
  let d = normalizeLongitude(lon - boundary);
  if (d > 180) d -= 360;
  return d;
}

// Binary search del instante en que Saturno cruza `boundary` dentro de la ventana.
function findSaturnCrossing(
  startISO: string,
  endISO: string,
  boundary: number,
): Date {
  let lo = new Date(startISO).getTime();
  let hi = new Date(endISO).getTime();
  const f = (t: number) =>
    signedDistance(eclipticLongitudeOfDate("Saturno", new Date(t)), boundary);
  const flo = f(lo);
  if (Math.sign(flo) === Math.sign(f(hi))) {
    throw new Error("no hay cruce limpio en la ventana");
  }
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (Math.sign(f(mid)) === Math.sign(flo)) lo = mid;
    else hi = mid;
  }
  return new Date((lo + hi) / 2);
}

const utcDate = (d: Date) => d.toISOString().slice(0, 10);

describe("fixtures ancla: ingresos de Saturno (confirmados con el engine)", () => {
  it("ingreso a Piscis = 2023-03-07", () => {
    const t = findSaturnCrossing("2023-01-01", "2023-06-01", 330);
    expect(utcDate(t)).toBe("2023-03-07");
  });

  it("ingreso a Aries (primer paso) = 2025-05-25", () => {
    const t = findSaturnCrossing("2025-03-01", "2025-08-01", 0);
    expect(utcDate(t)).toBe("2025-05-25");
  });

  it("retrograda de vuelta a Piscis = 2025-09-01", () => {
    const t = findSaturnCrossing("2025-08-15", "2025-12-01", 0);
    expect(utcDate(t)).toBe("2025-09-01");
  });

  it("reingreso a Aries (definitivo) = 2026-02-14", () => {
    const t = findSaturnCrossing("2026-01-01", "2026-06-01", 0);
    expect(utcDate(t)).toBe("2026-02-14");
  });
});
