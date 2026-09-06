import { describe, it, expect } from "vitest";
import type { ChartSnapshot, Sign, SignPosition, Body } from "../../astro/types";
import {
  generateHoroscope,
  generateHoroscopeSet,
  signAspect,
  summarizeSky,
  ZODIAC_ORDER,
} from "../index";

// Construye un ChartSnapshot sintético a 0° de cada signo dado, para probar la lógica de
// contenido sin depender de la efeméride. Cuerpos no especificados caen en Aries.
function makeSnapshot(signs: Partial<Record<Body, Sign>>): ChartSnapshot {
  const allBodies: Body[] = [
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
    "NodoNorte",
    "NodoSur",
  ];
  const positions: SignPosition[] = allBodies.map((body) => ({
    body,
    sign: signs[body] ?? "Aries",
    longitude: 0,
    degreeInSign: 0,
    retrograde: false,
  }));
  return {
    date: "2026-09-05T00:00:00.000Z",
    positions,
    moon: { phaseAngle: 180, phaseName: "Luna llena", illumination: 1 },
    engineVersion: "test",
  };
}

const EM_DASH = /[—–]/; // em-dash y en-dash: prohibidos (regla 6)

describe("signAspect (relación por signo)", () => {
  it("clasifica los aspectos mayores", () => {
    expect(signAspect("Aries", "Aries")).toBe("conjunción");
    expect(signAspect("Aries", "Libra")).toBe("oposición");
    expect(signAspect("Aries", "Cáncer")).toBe("cuadratura");
    expect(signAspect("Aries", "Leo")).toBe("trígono");
    expect(signAspect("Aries", "Géminis")).toBe("sextil");
    expect(signAspect("Aries", "Tauro")).toBe("tensión menor");
  });
});

describe("summarizeSky", () => {
  it("extrae el cielo del snapshot", () => {
    const snap = makeSnapshot({
      Sol: "Virgo",
      Luna: "Cáncer",
      Saturno: "Aries",
      Mercurio: "Virgo",
    });
    const sky = summarizeSky(snap);
    expect(sky.sunSign).toBe("Virgo");
    expect(sky.moonSign).toBe("Cáncer");
    expect(sky.slow.find((p) => p.body === "Saturno")?.sign).toBe("Aries");
    expect(sky.slow).toHaveLength(5);
  });
});

describe("generateHoroscopeSet", () => {
  const snap = makeSnapshot({
    Sol: "Virgo",
    Luna: "Piscis",
    Saturno: "Aries",
    Mercurio: "Virgo",
  });

  it("genera los 12 signos sin fallar", () => {
    const set = generateHoroscopeSet(snap);
    expect(set.horoscopes).toHaveLength(12);
    expect(set.horoscopes.map((h) => h.sign)).toEqual([...ZODIAC_ORDER]);
    for (const h of set.horoscopes) {
      expect(h.body.length).toBeGreaterThan(40);
      expect(h.title).toContain("temporada de Virgo");
    }
  });

  it("no usa em-dashes en ningún texto (regla 6)", () => {
    const set = generateHoroscopeSet(snap);
    expect(set.voiceGuideNote).not.toMatch(EM_DASH);
    for (const h of set.horoscopes) {
      expect(h.body).not.toMatch(EM_DASH);
      expect(h.title).not.toMatch(EM_DASH);
      expect(h.transitFocus).not.toMatch(EM_DASH);
    }
  });

  it("marca el registro como borrador (falta guía de voz)", () => {
    const set = generateHoroscopeSet(snap);
    expect(set.draft).toBe(true);
    expect(set.horoscopes.every((h) => h.draft)).toBe(true);
    expect(set.voiceGuideNote).toMatch(/BORRADOR/);
  });

  it("es determinista (mismo snapshot -> mismo texto)", () => {
    expect(generateHoroscopeSet(snap)).toEqual(generateHoroscopeSet(snap));
  });
});

describe("generateHoroscope (relación con Saturno)", () => {
  it("Aries con Saturno en Aries: conjunción", () => {
    const snap = makeSnapshot({ Sol: "Virgo", Saturno: "Aries" });
    const h = generateHoroscope(snap, "Aries");
    expect(h.transitFocus).toContain("conjunción");
    expect(h.body).toContain("cimiento");
  });

  it("Libra con Saturno en Aries: oposición", () => {
    const snap = makeSnapshot({ Sol: "Virgo", Saturno: "Aries" });
    const h = generateHoroscope(snap, "Libra");
    expect(h.transitFocus).toContain("oposición");
  });

  it("incluye nota de Mercurio retrógrado cuando aplica", () => {
    const base = makeSnapshot({ Sol: "Virgo", Saturno: "Aries" });
    const withRetro: ChartSnapshot = {
      ...base,
      positions: base.positions.map((p) =>
        p.body === "Mercurio" ? { ...p, retrograde: true } : p,
      ),
    };
    expect(generateHoroscope(withRetro, "Tauro").body).toMatch(
      /Mercurio va retrógrado/,
    );
    expect(generateHoroscope(base, "Tauro").body).not.toMatch(
      /Mercurio va retrógrado/,
    );
  });
});
