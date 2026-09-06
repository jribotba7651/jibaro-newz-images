import { describe, it, expect } from "vitest";
import {
  physicalPosition,
  isRetrograde,
  eclipticLongitudeOfDate,
  PHYSICAL_BODIES,
} from "../positions";

describe("positions", () => {
  it("calcula los 10 cuerpos físicos con longitud en rango y grado en [0,30)", () => {
    const date = new Date("2026-09-05T00:00:00Z");
    for (const body of PHYSICAL_BODIES) {
      const p = physicalPosition(body, date);
      expect(p.body).toBe(body);
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
      expect(p.degreeInSign).toBeGreaterThanOrEqual(0);
      expect(p.degreeInSign).toBeLessThan(30);
    }
  });

  it("Saturno bien adentro de cada período (robusto, no en cúspide)", () => {
    // Fechas a mitad de camino de cada tramo, lejos de cúspides. Los ingresos exactos
    // se prueban en fixtures.test.ts.
    expect(
      physicalPosition("Saturno", new Date("2024-06-01T00:00:00Z")).sign,
    ).toBe("Piscis");
    expect(
      physicalPosition("Saturno", new Date("2025-07-01T00:00:00Z")).sign,
    ).toBe("Aries");
    expect(
      physicalPosition("Saturno", new Date("2025-10-15T00:00:00Z")).sign,
    ).toBe("Piscis");
    expect(
      physicalPosition("Saturno", new Date("2026-05-01T00:00:00Z")).sign,
    ).toBe("Aries");
  });

  it("Sol y Luna nunca se marcan retrógrados", () => {
    const dates = ["2026-01-10", "2026-04-20", "2026-09-05"].map(
      (d) => new Date(d + "T00:00:00Z"),
    );
    for (const d of dates) {
      expect(physicalPosition("Sol", d).retrograde).toBe(false);
      expect(physicalPosition("Luna", d).retrograde).toBe(false);
    }
  });

  it("detecta retrogradación real de planetas (anclas verificadas con el engine)", () => {
    // Saturno: retro cerca de su oposición de 2025; directo en dic 2025.
    expect(isRetrograde("Saturno", new Date("2025-08-15T00:00:00Z"))).toBe(true);
    expect(isRetrograde("Saturno", new Date("2025-12-15T00:00:00Z"))).toBe(
      false,
    );
    // Júpiter retro en ene 2026.
    expect(isRetrograde("Júpiter", new Date("2026-01-10T00:00:00Z"))).toBe(true);
    // Mercurio: retro 2026-03-10, directo 2026-09-05.
    expect(isRetrograde("Mercurio", new Date("2026-03-10T00:00:00Z"))).toBe(
      true,
    );
    expect(isRetrograde("Mercurio", new Date("2026-09-05T00:00:00Z"))).toBe(
      false,
    );
  });

  it("es determinista (mismo Date -> misma longitud)", () => {
    const d = new Date("2026-02-14T00:00:00Z");
    expect(eclipticLongitudeOfDate("Saturno", d)).toBe(
      eclipticLongitudeOfDate("Saturno", d),
    );
  });
});
