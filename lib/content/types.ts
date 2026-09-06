import type { Sign, Body } from "../astro/types";

export type Element = "Fuego" | "Tierra" | "Aire" | "Agua";
export type Modality = "Cardinal" | "Fijo" | "Mutable";

export interface SignProfile {
  sign: Sign;
  element: Element;
  modality: Modality;
  /** Regente tradicional. */
  ruler: Body | "Luna" | "Sol";
  /** Frase de esencia, voz literaria del proyecto. */
  esencia: string;
}

/** Aspecto por signo (grueso, no por grado). */
export type SignAspect =
  | "conjunción"
  | "sextil"
  | "cuadratura"
  | "trígono"
  | "oposición"
  | "tensión menor";

export interface SkySummary {
  date: string;
  sunSign: Sign;
  moonSign: Sign;
  moonPhaseName: string;
  illumination: number;
  mercuryRetrograde: boolean;
  /** Planetas lentos: Júpiter a Plutón, con su signo y retrogradación. */
  slow: { body: Body; sign: Sign; retrograde: boolean }[];
  northNodeSign: Sign;
  southNodeSign: Sign;
}

export interface Horoscope {
  sign: Sign;
  element: Element;
  modality: Modality;
  ruler: string;
  title: string;
  body: string;
  /** Resumen del tránsito destacado (relación con Saturno). */
  transitFocus: string;
  /** true mientras falte la guía de voz del proyecto. */
  draft: boolean;
}

export interface HoroscopeSet {
  date: string;
  sky: SkySummary;
  horoscopes: Horoscope[];
  draft: boolean;
  voiceGuideNote: string;
}
