import type { Sign } from "../astro/types";
import type { SignProfile } from "./types";

// Definiciones de los 12 signos. Elemento, modalidad, regente tradicional y una frase de
// esencia en la voz del proyecto (literaria, diaspórica). El registro es BORRADOR hasta que
// existan biblia-traduccion.md y glosario-de-consistencia.md.
export const SIGN_PROFILES: Record<Sign, SignProfile> = {
  Aries: {
    sign: "Aries",
    element: "Fuego",
    modality: "Cardinal",
    ruler: "Marte",
    esencia: "el primer fuego, el que abre trocha aunque no haya camino",
  },
  Tauro: {
    sign: "Tauro",
    element: "Tierra",
    modality: "Fijo",
    ruler: "Venus",
    esencia: "la raíz que se aferra a la tierra buena y a lo que sabe a casa",
  },
  Géminis: {
    sign: "Géminis",
    element: "Aire",
    modality: "Mutable",
    ruler: "Mercurio",
    esencia: "la voz que traduce dos mundos y no escoge uno solo",
  },
  Cáncer: {
    sign: "Cáncer",
    element: "Agua",
    modality: "Cardinal",
    ruler: "Luna",
    esencia: "la memoria del agua, la que carga el hogar por dentro",
  },
  Leo: {
    sign: "Leo",
    element: "Fuego",
    modality: "Fijo",
    ruler: "Sol",
    esencia: "el sol que no pide permiso para calentar",
  },
  Virgo: {
    sign: "Virgo",
    element: "Tierra",
    modality: "Mutable",
    ruler: "Mercurio",
    esencia: "las manos que ordenan el caos con paciencia de artesano",
  },
  Libra: {
    sign: "Libra",
    element: "Aire",
    modality: "Cardinal",
    ruler: "Venus",
    esencia: "el fiel de la balanza, buscando la justa medida entre la gente",
  },
  Escorpio: {
    sign: "Escorpio",
    element: "Agua",
    modality: "Fijo",
    ruler: "Marte",
    esencia: "la marea honda que no le teme a lo que se esconde",
  },
  Sagitario: {
    sign: "Sagitario",
    element: "Fuego",
    modality: "Mutable",
    ruler: "Júpiter",
    esencia: "la flecha que apunta lejos, hacia el horizonte que llama",
  },
  Capricornio: {
    sign: "Capricornio",
    element: "Tierra",
    modality: "Cardinal",
    ruler: "Saturno",
    esencia: "la montaña que se sube despacio, piedra sobre piedra",
  },
  Acuario: {
    sign: "Acuario",
    element: "Aire",
    modality: "Fijo",
    ruler: "Saturno",
    esencia: "el aire que piensa en todos, el que sueña la tribu de mañana",
  },
  Piscis: {
    sign: "Piscis",
    element: "Agua",
    modality: "Mutable",
    ruler: "Júpiter",
    esencia: "el mar que lo disuelve todo en compasión y en sueño",
  },
};

// Orden zodiacal, para recorrer los 12 en orden.
export const ZODIAC_ORDER: readonly Sign[] = [
  "Aries",
  "Tauro",
  "Géminis",
  "Cáncer",
  "Leo",
  "Virgo",
  "Libra",
  "Escorpio",
  "Sagitario",
  "Capricornio",
  "Acuario",
  "Piscis",
] as const;
