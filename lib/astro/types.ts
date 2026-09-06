// Contratos de datos del motor. Ver CLAUDE.md seccion 3.
// No cambiar sin avisar: son la interfaz entre el motor y todo lo demas.

export type Sign =
  | "Aries"
  | "Tauro"
  | "Géminis"
  | "Cáncer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Escorpio"
  | "Sagitario"
  | "Capricornio"
  | "Acuario"
  | "Piscis";

export type Body =
  | "Sol"
  | "Luna"
  | "Mercurio"
  | "Venus"
  | "Marte"
  | "Júpiter"
  | "Saturno"
  | "Urano"
  | "Neptuno"
  | "Plutón"
  | "NodoNorte"
  | "NodoSur";

/** Cuerpo fisico calculable directo con astronomy-engine (Sol a Pluton). */
export type PhysicalBody = Exclude<Body, "NodoNorte" | "NodoSur">;

export interface SignPosition {
  body: Body;
  /** eclíptica TROPICAL DE FECHA, grados [0,360) */
  longitude: number;
  sign: Sign;
  /** [0,30) */
  degreeInSign: number;
  /** false para Sol, Luna y nodos */
  retrograde: boolean;
}

export interface MoonInfo {
  /** [0,360): 0 nueva, 90 cuarto creciente, 180 llena, 270 menguante */
  phaseAngle: number;
  phaseName: string;
  /** fraccion iluminada [0,1] */
  illumination: number;
}

export interface ChartSnapshot {
  /** ISO 8601 UTC, el input normalizado */
  date: string;
  positions: SignPosition[];
  moon: MoonInfo;
  /** version de astronomy-engine usada, para trazabilidad */
  engineVersion: string;
}
