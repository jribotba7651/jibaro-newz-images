import { describe, it, expect } from "vitest";
import { meanAscendingNodeLongitude, nodePositions } from "../node";
import { normalizeLongitude } from "../signs";

describe("nodo lunar medio (Meeus 47.7)", () => {
  it("en J2000.0 ≈ 125.0445° (constante base de Meeus)", () => {
    // 2000-01-01T12:00Z: T de TT ~ 0, asi que Ω ≈ 125.0445479 menos una deriva minima.
    const omega = meanAscendingNodeLongitude(
      new Date("2000-01-01T12:00:00Z"),
    );
    expect(omega).toBeCloseTo(125.0445, 3);
  });

  it("se mueve retrógrado ~19.34°/año (nodo descendente en el tiempo)", () => {
    const a = meanAscendingNodeLongitude(new Date("2026-01-01T00:00:00Z"));
    const b = meanAscendingNodeLongitude(new Date("2027-01-01T00:00:00Z"));
    let delta = b - a;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    expect(delta).toBeGreaterThan(-19.5);
    expect(delta).toBeLessThan(-19.1);
  });

  it("valor de regresión anclado (2026-09-05)", () => {
    // Ancla contra deriva accidental en refactors. Valor calculado por esta misma fórmula.
    expect(
      meanAscendingNodeLongitude(new Date("2026-09-05T00:00:00Z")),
    ).toBeCloseTo(329.0896, 3);
  });

  it("NodoSur = NodoNorte + 180 (mod 360), ambos no retrógrados", () => {
    const [norte, sur] = nodePositions(new Date("2026-09-05T00:00:00Z"));
    expect(norte.body).toBe("NodoNorte");
    expect(sur.body).toBe("NodoSur");
    expect(sur.longitude).toBeCloseTo(
      normalizeLongitude(norte.longitude + 180),
      9,
    );
    expect(norte.retrograde).toBe(false);
    expect(sur.retrograde).toBe(false);
  });

  it("longitud siempre en [0,360)", () => {
    for (const y of [1990, 2000, 2010, 2026, 2040]) {
      const omega = meanAscendingNodeLongitude(
        new Date(`${y}-06-15T00:00:00Z`),
      );
      expect(omega).toBeGreaterThanOrEqual(0);
      expect(omega).toBeLessThan(360);
    }
  });
});
