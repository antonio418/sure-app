// Normaliza el idioma de un lead a un código soportado por el motor de correos.
// Acepta la columna del Excel/CSV (S/E), códigos ISO (es/en/pt/...) y nombres comunes.
// Devuelve null si no reconoce el valor, para que el llamador use el fallback del proyecto.
export function normalizeLeadLang(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim().toLowerCase();
  if (!s) return null;
  if (['s', 'es', 'esp', 'espanol', 'español', 'spanish', 'castellano'].includes(s)) return 'es';
  if (['e', 'en', 'eng', 'ingles', 'inglés', 'english'].includes(s)) return 'en';
  // Otros idiomas ya soportados por el motor de correos pasan tal cual.
  if (['fr', 'de', 'pt', 'zh', 'ru', 'ar', 'hi', 'lt'].includes(s)) return s;
  return null;
}
