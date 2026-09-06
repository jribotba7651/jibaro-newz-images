import type { Body, ChartSnapshot, SignPosition } from "./types";
import { PHYSICAL_BODIES, physicalPosition } from "./positions";
import { nodePositions } from "./node";
import { moonInfo } from "./moon";

// Version de astronomy-engine usada. Mantener en sync con package.json.
// (El paquete no exporta su version en runtime y su exports-map bloquea require del
// package.json, asi que se fija aqui. snapshot.test.ts verifica que coincida con la instalada.)
export const ENGINE_VERSION = "astronomy-engine@2.1.19";

// Orden canónico de salida de las posiciones.
const BODY_ORDER: readonly Body[] = [
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
] as const;

/**
 * Arma el ChartSnapshot completo para una fecha UTC.
 * Determinista: mismo Date de entrada -> mismo snapshot.
 */
export function buildChartSnapshot(date: Date): ChartSnapshot {
  const positions: SignPosition[] = [
    ...PHYSICAL_BODIES.map((body) => physicalPosition(body, date)),
    ...nodePositions(date),
  ];
  positions.sort(
    (a, b) => BODY_ORDER.indexOf(a.body) - BODY_ORDER.indexOf(b.body),
  );

  return {
    date: date.toISOString(),
    positions,
    moon: moonInfo(date),
    engineVersion: ENGINE_VERSION,
  };
}
