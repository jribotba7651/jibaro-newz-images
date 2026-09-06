import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildChartSnapshot, ENGINE_VERSION } from "../snapshot";
import type { Body } from "../types";

const EXPECTED_ORDER: Body[] = [
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

describe("buildChartSnapshot", () => {
  const date = new Date("2026-09-05T00:00:00Z");

  it("incluye los 12 cuerpos en orden canónico", () => {
    const snap = buildChartSnapshot(date);
    expect(snap.positions).toHaveLength(12);
    expect(snap.positions.map((p) => p.body)).toEqual(EXPECTED_ORDER);
  });

  it("normaliza la fecha a ISO 8601 UTC", () => {
    const snap = buildChartSnapshot(date);
    expect(snap.date).toBe("2026-09-05T00:00:00.000Z");
  });

  it("trae info de luna coherente", () => {
    const snap = buildChartSnapshot(date);
    expect(typeof snap.moon.phaseName).toBe("string");
    expect(snap.moon.illumination).toBeGreaterThanOrEqual(0);
    expect(snap.moon.illumination).toBeLessThanOrEqual(1);
  });

  it("es determinista (mismo input -> mismo output)", () => {
    expect(buildChartSnapshot(date)).toEqual(buildChartSnapshot(date));
  });

  it("engineVersion coincide con la versión instalada de astronomy-engine", () => {
    // Verifica que el string fijado en snapshot.ts no se quede atras del paquete instalado.
    const here = dirname(fileURLToPath(import.meta.url));
    const pkgPath = join(
      here,
      "..",
      "..",
      "..",
      "node_modules",
      "astronomy-engine",
      "package.json",
    );
    const installed = JSON.parse(readFileSync(pkgPath, "utf8")).version;
    expect(ENGINE_VERSION).toBe(`astronomy-engine@${installed}`);
  });
});
