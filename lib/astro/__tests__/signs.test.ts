import { describe, it, expect } from "vitest";
import { signFromLongitude, normalizeLongitude, SIGNS } from "../signs";

describe("signs", () => {
  it("normaliza a [0,360)", () => {
    expect(normalizeLongitude(0)).toBe(0);
    expect(normalizeLongitude(360)).toBe(0);
    expect(normalizeLongitude(-1)).toBeCloseTo(359, 10);
    expect(normalizeLongitude(725)).toBeCloseTo(5, 10);
  });

  it("hay 12 signos en orden desde Aries", () => {
    expect(SIGNS).toHaveLength(12);
    expect(SIGNS[0]).toBe("Aries");
    expect(SIGNS[11]).toBe("Piscis");
  });

  it("mapea longitud a signo y grado", () => {
    expect(signFromLongitude(0)).toEqual({ sign: "Aries", degreeInSign: 0 });

    const casiTauro = signFromLongitude(29.999);
    expect(casiTauro.sign).toBe("Aries");
    expect(casiTauro.degreeInSign).toBeCloseTo(29.999, 9);

    expect(signFromLongitude(30)).toEqual({ sign: "Tauro", degreeInSign: 0 });

    const piscis = signFromLongitude(335);
    expect(piscis.sign).toBe("Piscis");
    expect(piscis.degreeInSign).toBeCloseTo(5, 9);
  });

  it("maneja el cruce 360 -> 0 Aries", () => {
    expect(signFromLongitude(360)).toEqual({ sign: "Aries", degreeInSign: 0 });
    expect(signFromLongitude(359.9).sign).toBe("Piscis");
  });
});
