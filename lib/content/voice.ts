import type { SignAspect } from "./types";

// Tablas de frases. Voz literaria diaspórica, registro BORRADOR (falta la guía del proyecto).
// La generación es determinista: se elige por clave fija (fase, aspecto), sin aleatoriedad.
// Regla dura: nada de em-dashes.

export const PHASE_VOICE: Record<string, string> = {
  "Luna nueva": "tiempo de semilla, de intención dicha bajito",
  "Luna creciente": "algo empieza a tomar cuerpo, dale agua",
  "Cuarto creciente": "toca empujar, la cuesta pide decisión",
  "Gibosa creciente": "casi, ajusta los detalles antes de que madure",
  "Luna llena": "todo se alumbra, lo bueno y lo que había que mirar",
  "Gibosa menguante": "tiempo de agradecer y de soltar lo de más",
  "Cuarto menguante": "se poda lo que ya no da fruto",
  "Luna menguante": "descanso, el cuerpo pide adentro antes del próximo ciclo",
};

// Relación del signo del lector con Saturno, el maestro de esta era (2023-2026: Piscis a Aries).
export const SATURN_ASPECT_VOICE: Record<SignAspect, string> = {
  conjunción:
    "Saturno te toca de cerca: la vida te pide estructura y madurez donde antes ibas suelto. No es castigo, es cimiento.",
  oposición:
    "Saturno te mira de frente desde el signo opuesto. Los límites llegan por medio de otros, en la relación y el acuerdo. Negocia sin perderte.",
  cuadratura:
    "Saturno te hace fricción. Hay una prueba que no se esquiva, y ahí mismo está la lección. Lo que aguante ahora, aguanta después.",
  "trígono":
    "Saturno te da la mano. Buen tiempo para construir con calma lo que quieres que dure. El esfuerzo cuaja.",
  sextil:
    "Saturno te ofrece una puerta discreta para poner orden. Gesto pequeño, fruto largo.",
  "tensión menor":
    "Saturno anda por otro rincón del cielo, sin tocarte directo. Aprovecha para respirar y mirar desde lejos.",
};

export const MERCURY_RETRO_NOTE =
  "Mercurio va retrógrado: relee antes de mandar, confirma antes de firmar, y ten paciencia con los enredos de palabra.";

// Cierre por elemento, para variar el tono según la naturaleza del signo.
export const ELEMENT_CLOSING: Record<string, string> = {
  Fuego: "Que el fuego te caliente sin quemarte la casa.",
  Tierra: "Pon los pies donde el suelo aguante, y de ahí crece.",
  Aire: "Deja que la idea respire antes de soltarla al mundo.",
  Agua: "Hazle caso a la corriente honda, esa no miente.",
};
