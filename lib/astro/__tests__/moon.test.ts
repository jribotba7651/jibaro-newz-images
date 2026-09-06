import { describe, it, expect } from "vitest";
import { phaseName, moonInfo } from "../moon";

describe("moon", () => {
  it("nombra las fases por ángulo", () => {
    expect(phaseName(0)).toBe("Luna nueva");
    expect(phaseName(359)).toBe("Luna nueva");
    expect(phaseName(45)).toBe("Luna creciente");
    expect(phaseName(90)).toBe("Cuarto creciente");
    expect(phaseName(135)).toBe("Gibosa creciente");
    expect(phaseName(180)).toBe("Luna llena");
    expect(phaseName(225)).toBe("Gibosa menguante");
    expect(phaseName(270)).toBe("Cuarto menguante");
    expect(phaseName(315)).toBe("Luna menguante");
  });

  it("calcula fase e iluminación para fechas ancla (verificadas con el engine)", () => {
    // 2026-01-03: casi llena (fase ~174°, iluminación ~0.996).
    const llena = moonInfo(new Date("2026-01-03T00:00:00Z"));
    expect(llena.phaseAngle).toBeGreaterThan(150);
    expect(llena.phaseAngle).toBeLessThan(200);
    expect(llena.phaseName).toBe("Luna llena");
    expect(llena.illumination).toBeGreaterThan(0.95);

    // 2026-01-18: casi nueva (fase ~350°, iluminación ~0.008).
    const nueva = moonInfo(new Date("2026-01-18T00:00:00Z"));
    expect(nueva.phaseName).toBe("Luna nueva");
    expect(nueva.illumination).toBeLessThan(0.05);
  });

  it("iluminación en [0,1] y fase en [0,360)", () => {
    const m = moonInfo(new Date("2026-09-05T00:00:00Z"));
    expect(m.illumination).toBeGreaterThanOrEqual(0);
    expect(m.illumination).toBeLessThanOrEqual(1);
    expect(m.phaseAngle).toBeGreaterThanOrEqual(0);
    expect(m.phaseAngle).toBeLessThan(360);
  });
});
