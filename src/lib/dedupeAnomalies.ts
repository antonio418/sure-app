// Fusiona hallazgos duplicados del informe final.
// Caso que resuelve: en modo Proyecto el consolidador reproduce el hallazgo de un
// especialista y vuelve a emitirlo con la etiqueta "Cross-dimension". Aquí se
// detectan esos pares por solapamiento de términos específicos (cifras, nombres,
// referencias) y se deja UN solo hallazgo, el que lleva la etiqueta cruzada.

export interface ReportAnomaly {
  title: string;
  description: string;
}

const CROSS_TITLE = /cross[\s-]*dimension|inter[\s-]*dimension|dimensi[oó]n(es)?\s+cruzada|cruce\s+de\s+dimensi|cruzad/i;
const MIN_SHARED = 7;
const MIN_OVERLAP = 0.4;
const COMMON_SHARE = 0.4;

function tokens(a: ReportAnomaly): string[] {
  const text = (a.title + ' ' + a.description).toLowerCase();
  const found = text.match(/[a-z0-9áéíóúñ]+(?:[.,][0-9]+)?/g) || [];
  return found.filter((t) => t.length >= 4 || /^[0-9]/.test(t));
}

export function dedupeAnomalies(items: ReportAnomaly[]): ReportAnomaly[] {
  if (!Array.isArray(items) || items.length < 2) return items;

  const sets = items.map((a) => new Set(tokens(a)));

  // Términos que aparecen en muchos hallazgos (Article, Contract, 2026...) no
  // sirven para distinguir un conflicto de otro.
  const freq = new Map<string, number>();
  sets.forEach((s) => s.forEach((t) => freq.set(t, (freq.get(t) || 0) + 1)));
  const limit = Math.max(3, Math.ceil(items.length * COMMON_SHARE));
  const distinct = sets.map((s) => new Set(Array.from(s).filter((t) => (freq.get(t) || 0) <= limit)));

  const removed = new Set<number>();
  const result: ReportAnomaly[] = items.map((a) => ({ ...a }));

  for (let i = 0; i < items.length; i++) {
    if (removed.has(i)) continue;
    for (let j = i + 1; j < items.length; j++) {
      if (removed.has(j)) continue;
      const iCross = CROSS_TITLE.test(items[i].title || '');
      const jCross = CROSS_TITLE.test(items[j].title || '');
      // Solo se fusiona cuando exactamente uno de los dos lleva la etiqueta cruzada.
      if (iCross === jCross) continue;

      let shared = 0;
      distinct[i].forEach((t) => { if (distinct[j].has(t)) shared++; });
      const smaller = Math.min(distinct[i].size, distinct[j].size);
      if (smaller === 0) continue;
      if (shared >= MIN_SHARED && shared / smaller >= MIN_OVERLAP) {
        const keep = iCross ? i : j;
        const drop = iCross ? j : i;
        // El hallazgo cruzado conserva su título y descripción y ocupa la posición
        // del primero de los dos, para no alterar el orden del informe.
        const first = Math.min(i, j);
        if (keep !== first) result[first] = { ...items[keep] };
        removed.add(keep !== first ? keep : drop);
        break;
      }
    }
  }

  return result.filter((_, idx) => !removed.has(idx));
}
