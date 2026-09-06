// Helper compartido para parsear el parámetro ?date=... de las rutas API.
// Acepta ISO 8601 (ej. 2026-09-06 o 2026-09-06T12:00:00Z). Sin fecha -> ahora.

export interface ParsedDate {
  date: Date;
  error?: string;
}

export function parseDateParam(raw: string | null): ParsedDate {
  if (!raw || raw.trim() === "") return { date: new Date() };
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return {
      date: new Date(),
      error: `Fecha inválida: "${raw}". Usa ISO 8601, ej. ?date=2026-09-06`,
    };
  }
  return { date };
}
