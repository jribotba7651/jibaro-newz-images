// API pública de la capa de contenido.
// Determinista: mismo ChartSnapshot -> mismo texto. Sin llamadas de red, sin LLM.
// Registro en BORRADOR hasta que existan biblia-traduccion.md y glosario-de-consistencia.md.

export type {
  Element,
  Modality,
  SignProfile,
  SignAspect,
  SkySummary,
  Horoscope,
  HoroscopeSet,
} from "./types";

export { SIGN_PROFILES, ZODIAC_ORDER } from "./profiles";
export { summarizeSky, signAspect } from "./sky";
export { generateHoroscope, generateHoroscopeSet } from "./horoscope";
export {
  SIGN_SLUGS,
  ALL_SLUGS,
  signToSlug,
  slugToSign,
} from "./slugs";
