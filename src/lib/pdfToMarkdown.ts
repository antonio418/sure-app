/**
 * pdfToMarkdown.ts — SURE RMA / MB PROCDI
 *
 * Conversión LOCAL (en el navegador) de PDF con texto nativo a Markdown limpio,
 * sin IA y sin subir el PDF al servidor. Reemplaza, para PDFs con capa de texto,
 * el camino anterior (troceo en bloques de 2 páginas + Gemini por bloque).
 *
 * Qué hace:
 *  1. Lee cada fragmento de texto del PDF con su posición y tamaño de letra (pdf.js vía unpdf).
 *  2. Reconstruye las líneas y recoloca superíndices/subíndices por tamaño de letra
 *     (mm2 -> mm², U p -> Up).
 *  3. Quita encabezados y pies repetidos en cada página (los deja una vez al inicio, en tabla).
 *  4. Une líneas cortadas en párrafos y palabras partidas con guion.
 *  5. Títulos numerados -> encabezados; "Parámetro : valor" -> tabla;
 *     planillas con líneas de puntos -> tabla rellenable (Nº | Dato | Unidad | Valor ofertado).
 *  6. Escapa todo símbolo de Markdown: ningún carácter del documento se interpreta como código.
 *
 * Si el PDF no tiene texto (escaneado) devuelve { ok: false } y el llamador debe
 * usar el camino con IA de siempre.
 */

// ------------------------------------------------------------------ tipos
interface Item { str: string; x: number; y: number; fs: number; w: number }
interface Run { text: string; x: number }
interface Line { text: string; x: number; y: number; fs: number; runs: Run[]; page: number }

export interface PdfToMarkdownResult {
  ok: boolean;              // false => sin texto suficiente (probablemente escaneado)
  markdown: string;
  pages: number;
  chars: number;
}

const MIN_CHARS_PER_PAGE = 40;

// ------------------------------------------------------------------ extracción
export async function pdfToMarkdown(data: ArrayBuffer | Uint8Array): Promise<PdfToMarkdownResult> {
  const { getDocumentProxy } = await import('unpdf');
  const bytes = new Uint8Array(data); // copia: pdf.js no acepta Buffer de Node
  const pdf = await getDocumentProxy(bytes);
  const pages: Line[][] = [];
  let chars = 0;

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const tc = await page.getTextContent();
    const items: Item[] = [];
    for (const it of tc.items as any[]) {
      if (typeof it.str !== 'string' || it.str === '') continue;
      const t = it.transform as number[];
      const fs = Math.hypot(t[2], t[3]) || Math.abs(t[3]) || 10;
      items.push({ str: it.str, x: t[4], y: t[5], fs, w: it.width || 0 });
      chars += it.str.trim().length;
    }
    pages.push(buildLines(items).map(l => ({ ...l, page: p })));
    page.cleanup?.();
  }
  try { await (pdf as any).destroy?.(); } catch { /* sin efecto */ }

  if (chars < MIN_CHARS_PER_PAGE * Math.max(1, pdf.numPages) * 0.5) {
    return { ok: false, markdown: '', pages: pdf.numPages, chars };
  }

  const { header, pages: clean } = removeRepeated(pages);
  const md = headerTable(header) + '\n' + convert(clean);
  return { ok: true, markdown: md, pages: pdf.numPages, chars };
}

// Agrupa fragmentos en líneas; los fragmentos pequeños desplazados son super/subíndices.
function buildLines(items: Item[]): Omit<Line, 'page'>[] {
  const main = items.slice().sort((a, b) => b.fs - a.fs);
  const groups: { y: number; fs: number; items: Item[] }[] = [];

  for (const it of main) {
    let best: (typeof groups)[number] | null = null;
    let bestD = Infinity;
    for (const g of groups) {
      const d = it.y - g.y;
      const small = it.fs < 0.8 * g.fs && it.str.trim().length <= 3;
      const fits = small
        ? d > -0.45 * g.fs && d < 0.75 * g.fs
        : Math.abs(d) < 0.5 * Math.min(it.fs, g.fs);
      if (fits && Math.abs(d) < bestD) { best = g; bestD = Math.abs(d); }
    }
    if (best) best.items.push(it);
    else groups.push({ y: it.y, fs: it.fs, items: [it] });
  }

  const lines: Omit<Line, 'page'>[] = groups.map(g => {
    const its = g.items.sort((a, b) => a.x - b.x);
    let text = '';
    let end = -Infinity;
    const runs: Run[] = [];
    for (const it of its) {
      const isScript = it.fs < 0.8 * g.fs && it.str.trim().length <= 3 && Math.abs(it.y - g.y) > 0.15 * g.fs;
      let s = it.str;
      if (isScript) {
        const sup = it.y > g.y + 0.1 * g.fs;
        if (sup && /^[23]$/.test(s.trim()) && /m$/.test(text)) s = s.trim() === '2' ? '²' : '³';
        else s = s.trim();
        text += s;
        if (runs.length) runs[runs.length - 1].text += s;
        continue; // el hueco se mide desde el texto normal, no desde el índice
      } else {
        if (!s.trim()) continue; // los espacios del PDF pueden medir cualquier ancho: el hueco se mide entre textos
        const gap = it.x - end;
        if (text && gap > 1.2 * g.fs) {
          text = text.replace(/\s+$/, '') + '   ';
          if (s.trim()) runs.push({ text: '', x: it.x });
        } else if (text && gap > 0.12 * g.fs && !/\s$/.test(text) && !/^\s/.test(s)) {
          text += ' ';
          if (runs.length) runs[runs.length - 1].text += ' ';
        }
        if (!runs.length && s.trim()) runs.push({ text: '', x: it.x });
        text += s;
        if (runs.length) runs[runs.length - 1].text += s;
      }
      end = Math.max(end, it.x + it.w);
    }
    const x = its.find(i => !(i.fs < 0.8 * g.fs && i.str.trim().length <= 3))?.x ?? its[0].x;
    const cleanRuns = runs.map(r => ({ text: r.text.trim(), x: r.x })).filter(r => r.text);
    return { text: text.replace(/\s+$/, ''), x, y: g.y, fs: g.fs, runs: cleanRuns };
  }).filter(l => l.text.trim());

  lines.sort((a, b) => b.y - a.y || a.x - b.x);
  return lines;
}

// ------------------------------------------------ encabezados / pies repetidos
const norm = (s: string) => s.trim().replace(/\s+/g, ' ')
  .replace(/\b(p[áa]g(ina)?\.?|page)\s*/gi, '')
  .replace(/\d+\s*(\/|de|of)\s*\d+/gi, '#');

// Margen izquierdo del documento = posición x más frecuente de las líneas.
function leftMargin(pages: Line[][]): number {
  const c = new Map<number, number>();
  for (const p of pages) for (const l of p) { const k = Math.round(l.x); c.set(k, (c.get(k) || 0) + 1); }
  let best = 0, n = -1;
  c.forEach((v, k) => { if (v > n) { n = v; best = k; } });
  return best;
}

function removeRepeated(pages: Line[][]): { header: string[]; pages: Line[][] } {
  const n = pages.length;
  const zones = pages.map(p => {
    const idx = p.map((_, k) => k);
    return new Set([...idx.slice(0, 4), ...idx.slice(-4)]);
  });
  const count = new Map<string, number>();
  pages.forEach((p, i) => {
    const seen = new Set<string>();
    zones[i].forEach(k => seen.add(norm(p[k].text)));
    seen.forEach(t => count.set(t, (count.get(t) || 0) + 1));
  });
  const threshold = n > 2 ? Math.max(2, Math.min(3, Math.floor(n / 2))) : Infinity;
  const margin = leftMargin(pages);
  // Encabezado de tabla que se repite en cada página: se conserva (la tabla lo necesita).
  const isTableHeader = (p: Line[], k: number) => {
    const l = p[k];
    return l.runs.length >= 3 && l.x >= margin + 15 && l.runs.every(r => r.text.length <= 25)
      && p.slice(k + 1, k + 9).some(nx => nx.runs.length >= 2 && nx.x >= margin + 15);
  };
  const header: string[] = [];
  const out = pages.map((p, i) => p.filter((l, k) => {
    if (zones[i].has(k) && (count.get(norm(l.text)) || 0) >= threshold && !isTableHeader(p, k)) {
      if (i === 0) header.push(l.text);
      return false;
    }
    return true;
  }));
  return { header, pages: out };
}

function headerTable(cab: string[]): string {
  const cells = cab.map(l => l.trim().split(/\s{2,}/).map(c => c.trim())
    .filter(c => c && !/^\d+\s*\/\s*\d+$/.test(c)));
  const rows: [string, string][] = [];
  const loose: string[] = [];
  for (let k = 0; k < cells.length; k++) {
    const a = cells[k], b = cells[k + 1] || [];
    if (a.length >= 3 && b.length >= 3 && !b.some(x => x.includes(':'))) {
      a.forEach((x, j) => { if (j < b.length) rows.push([x, b[j]]); else loose.push(x); });
      k++;
      continue;
    }
    loose.push(...a);
  }
  const res: string[] = [];
  const title = loose.filter(x => !x.includes(':')).map(esc).join(' · ');
  if (title) res.push(`**${title}**\n`);
  loose.filter(x => x.includes(':')).forEach(x => {
    const i = x.indexOf(':');
    rows.push([x.slice(0, i).trim(), x.slice(i + 1).trim()]);
  });
  if (rows.length) {
    res.push('| Dato | Valor |', `|${'-'.repeat(40)}|${'-'.repeat(60)}|`);
    rows.forEach(([a, b]) => res.push(`| ${esc(a)} | ${esc(b)} |`));
    res.push('');
  }
  return res.join('\n');
}

// ------------------------------------------------------------------ escapado
export function esc(t: string): string {
  return t
    .replace(/[‘’´`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\\/g, '\\\\')
    .replace(/([*_[\]<>|#~])/g, '\\$1')
    .replace(/^(\s*)([-+=])/, '$1\\$2')
    .replace(/^(\s*\d+)([.)])(\s)/, '$1\\$2$3');
}

// ------------------------------------------------------------------ análisis
const RE_TIT = /^(\d+(?:\.\d+)*)\.?\s+(\S.*)$/;
const RE_DOTS = /\.{4,}|…{2,}/;
const RE_DOTS_G = /\.{4,}|…{2,}/g;
const UNITS = /^(kV|V|kA|A|mm2|mm²|mm|m|km|ºC|°C|kg|kg\/km|ohm\/km|Ω\/km|min|s|Hz|%|MVA|kVA|MVAR|t|pC|dB)$/;

function isUpper(t: string): boolean {
  const letters = [...t].filter(c => /\p{L}/u.test(c));
  if (letters.length < 2) return false;
  return letters.filter(c => c === c.toUpperCase() && c !== c.toLowerCase()).length / letters.length > 0.8;
}

function kv(s: string): [string, string] | null {
  s = s.trim();
  if (RE_DOTS.test(s)) return null;
  const m = s.match(/^(.+?)\s{2,}:\s*(.+)$/) || s.match(/^(.+?\S)\s+:\s+(.+)$/);
  if (m && m[1].length < 90) return [m[1].trim(), m[2].trim()];
  return null;
}

function planillaFields(text: string, group: string | null): { fields: [string, string][]; group: string | null } {
  const raw = text.split(RE_DOTS_G).map(t => t.replace(/^[\s.…]+|[\s.…]+$/g, ''));
  const fields: [string, string][] = [];
  for (const r of raw) {
    const t = r.replace(/:+$/, '').trim();
    if (!t) continue;
    if (UNITS.test(t) && fields.length) {
      const last = fields[fields.length - 1];
      if (last[1]) fields.push([last[0], t]); else last[1] = t;
      continue;
    }
    const parts = r.split(':').map(p => p.trim()).filter(Boolean);
    let label: string;
    if (parts.length > 1) { group = parts[0]; label = parts.join(' – '); }
    else if (group) label = parts[0] && parts[0] !== group ? `${group} – ${parts[0]}` : group;
    else label = parts[0] || '';
    fields.push([label, '']);
  }
  return { fields, group };
}

const BULLET = /^[\uF000-\uF0FF\u2022\u2023\u2043\u25AA\u25AB\u25CF\u25E6\u25CB\u25A0\u25A1\u25C6\u25C7\u2666\u27A2\u25BA\u2713\u2714]\s*/;
const BULLET_ANY = /\s*[\uF000-\uF0FF\u2022\u2023\u2043\u25AA\u25AB\u25CF\u25E6\u25CB\u25A0\u25A1\u25C6\u25C7\u2666\u27A2\u25BA\u2713\u2714]\s*/;
const SUB_BULLET = /^[-–]\s+(?=\p{L})/u;
const RE_TOC_DOTS = /^(.*?\S)\s*(?:\.{4,}|…{2,})\s*(\d{1,3})$/;
const RE_TOC_NUM = /^(\d+(?:\.\d+)*\.?\s+\S.*?)\s+(\d{1,3})$/;

// Tabla con cuadrícula: columnas por posición horizontal; líneas muy juntas = misma fila.
function renderTable(seg: Line[]): string[] {
  const hasHeader = seg[0].runs.length >= 3 && seg[0].runs.every(r => r.text.length <= 25);
  const starts = (hasHeader ? seg.slice(1) : seg).flatMap(l => l.runs.map(r => r.x)).sort((a, b) => a - b);
  const cols: [number, number][] = [];
  for (const x of starts) {
    const last = cols[cols.length - 1];
    if (last && x - last[1] <= 18) last[1] = x; else cols.push([x, x]);
  }
  const colOf = (x: number) => {
    let best = 0, bd = Infinity;
    cols.forEach(([a, b], k) => { const d = x < a ? a - x : x > b ? x - b : 0; if (d < bd) { bd = d; best = k; } });
    return best;
  };
  const cellsOf = (l: Line) => {
    const c: string[] = cols.map(() => '');
    l.runs.forEach(r => { const k = colOf(r.x); c[k] = (c[k] ? c[k] + ' ' : '') + r.text; });
    return c;
  };
  let header: string[] | null = null;
  let body = seg;
  if (hasHeader) {
    header = cellsOf(seg[0]);
    const hn = norm(seg[0].text);
    body = seg.slice(1).filter(l => norm(l.text) !== hn);
  }
  const rows: string[][] = [];
  let prev: Line | null = null;
  const MARK = /^([a-zA-Z]\)|[-–•]\s)/;
  for (const l of body) {
    const c = cellsOf(l);
    const firstText = c.slice(1).find(t => t) || '';
    const gap = prev ? prev.y - l.y : Infinity;
    const sameCol = !!prev && prev.runs.length === 1 && l.runs.length === 1 && colOf(prev.runs[0].x) === colOf(l.runs[0].x);
    const wrap = sameCol && gap < 1.3 * l.fs && !MARK.test(l.runs[0].text) && !/^\p{Lu}/u.test(l.runs[0].text);
    const cur = rows[rows.length - 1];
    const startsItem = MARK.test(firstText) && !!cur && c.some((t, k) => k > 0 && t && MARK.test(t) && cur[k]);
    if (prev && prev.page === l.page && rows.length && ((gap < 0.75 * l.fs && !startsItem) || wrap)) {
      const row = rows[rows.length - 1];
      c.forEach((t, k) => { if (t) row[k] = row[k] ? `${row[k]} ${t}` : t; });
    } else rows.push(c);
    prev = l;
  }
  const used = cols.map((_, k) => rows.some(r => r[k]) || !!(header && header[k]));
  const pick = (r: string[]) => r.filter((_, k) => used[k]);
  const n = used.filter(Boolean).length;
  const out: string[] = [];
  out.push(`| ${pick(header || cols.map(() => ' ')).map(t => esc(t) || ' ').join(' | ')} |`);
  out.push(`|${Array(n).fill('---').join('|')}|`);
  rows.forEach(r => out.push(`| ${pick(r).map(esc).join(' | ')} |`));
  out.push('');
  return out;
}

function convert(pages: Line[][]): string {
  const margin = leftMargin(pages);
  // Detectar zonas de tabla por página: bloque sangrado con varias líneas de 3+ columnas.
  const tableOf = new Map<Line, number>();
  let tid = 0;
  const isTabLine = (l: Line) => l.x >= margin + 15 && !RE_DOTS.test(l.text) && !BULLET.test(l.text.trim());
  for (const p of pages) {
    let k = 0;
    while (k < p.length) {
      if (!isTabLine(p[k])) { k++; continue; }
      let j = k;
      while (j < p.length && isTabLine(p[j])) j++;
      const seg = p.slice(k, j);
      if (seg.filter(l => l.runs.length >= 3).length >= 3) { tid++; seg.forEach(l => tableOf.set(l, tid)); }
      k = j;
    }
  }

  // Aplanar con líneas en blanco donde hay salto vertical grande o cambio de página.
  const lines: { raw: string; indent: number; line?: Line; table?: number }[] = [];
  for (const p of pages) {
    const left = Math.min(...p.map(l => l.x));
    p.forEach((l, k) => {
      if (k > 0 && p[k - 1].y - l.y > 1.9 * l.fs && !(tableOf.get(l) && tableOf.get(l) === tableOf.get(p[k - 1])))
        lines.push({ raw: '', indent: 0 });
      lines.push({ raw: l.text, indent: l.x - left, line: l, table: tableOf.get(l) });
    });
    lines.push({ raw: '', indent: 0 });
  }

  const md: string[] = [];
  const para: string[] = [];
  let paraBullet = 0, paraIndent = 0;
  const kvRows: [string, string][] = [];
  const plan: [string, string, string][] = [];
  const toc: string[] = [];
  const st = { item: '' as string, group: null as string | null, hasRow: false, groupOpen: false, inPlan: false, kvGroup: null as string | null, inToc: false };

  const closePara = () => {
    if (para.length) {
      const t = esc(para.join(' '));
      md.push(paraBullet === 1 ? `- ${t}` : paraBullet === 2 ? `  - ${t}` : t, '');
      para.length = 0;
    }
    paraBullet = 0;
  };
  const closeKv = () => {
    if (!kvRows.length) return;
    md.push('| Parámetro | Valor |', `|${'-'.repeat(62)}|${'-'.repeat(38)}|`);
    kvRows.forEach(([a, b]) => md.push(`| ${esc(a)} | ${esc(b)} |`));
    md.push('');
    kvRows.length = 0;
  };
  const closePlan = () => {
    if (plan.length) {
      md.push('| Nº | Dato solicitado | Unidad | Valor ofertado |',
        `|${'-'.repeat(6)}|${'-'.repeat(50)}|${'-'.repeat(12)}|${'-'.repeat(32)}|`);
      plan.forEach(([n, e, u]) => md.push(`| ${esc(n)} | ${esc(e)} | ${esc(u)} |  |`));
      md.push('');
      plan.length = 0;
    }
    st.inPlan = false;
  };
  const closeToc = () => {
    if (toc.length) { md.push(...toc, ''); toc.length = 0; }
    st.inToc = false;
  };
  const closeAll = () => { closePara(); closeKv(); closePlan(); closeToc(); };
  const nextNonEmpty = (from: number, skip = 0) => {
    for (let k = from; k < lines.length; k++) if (lines[k].raw.trim()) { if (skip-- <= 0) return lines[k].raw.trim(); }
    return '';
  };
  const isTocLine = (t: string) => RE_TOC_DOTS.test(t) || (st.inToc && RE_TOC_NUM.test(t));
  // Une a un título las líneas en mayúsculas que lo continúan (títulos largos partidos en dos).
  const headingTail = (i: number) => {
    let extra = '';
    while (i + 1 < lines.length) {
      const nx = lines[i + 1];
      const t = nx.raw.trim();
      if (!t || nx.table || !isUpper(t) || RE_TIT.test(t) || RE_DOTS.test(t) || kv(t) || t.length > 90) break;
      extra += ' ' + t.replace(/\s{2,}/g, ' ');
      i++;
    }
    return { extra, i };
  };

  for (let i = 0; i < lines.length; i++) {
    const { raw, indent } = lines[i];
    let s = raw.trim();

    // ---- tablas con cuadrícula
    if (lines[i].table) {
      closeAll();
      const id = lines[i].table;
      const seg: Line[] = [];
      while (i < lines.length && (lines[i].table === id || (!lines[i].raw.trim() && lines[i + 1]?.table === id))) {
        if (lines[i].line && lines[i].table === id) seg.push(lines[i].line!);
        i++;
      }
      i--;
      md.push(...renderTable(seg));
      continue;
    }

    if (!s) {
      if (st.inToc) continue;
      const nxt = nextNonEmpty(i + 1);
      if (para.length && !(/^\p{Ll}/u.test(nxt) && !/[.:;]$/.test(para[para.length - 1]))) closePara();
      continue;
    }

    // ---- índice (tabla de contenido / lista de tablas)
    if (isTocLine(s)) {
      if (!st.inToc) { closePara(); closeKv(); closePlan(); st.inToc = true; }
      const m = s.match(RE_TOC_DOTS) || s.match(RE_TOC_NUM)!;
      const title = [...para, m[1]].join(' ').replace(/\s{2,}/g, ' ').replace(/[\s.…]+$/, '');
      para.length = 0;
      toc.push(`- ${esc(title)} (${m[2]})`);
      continue;
    }
    if (st.inToc) {
      if (isUpper(s) && !RE_TIT.test(s) && s.length < 60) { closeToc(); md.push(`# ${esc(s)}`, ''); st.inToc = true; continue; }
      const a = nextNonEmpty(i + 1), b = nextNonEmpty(i + 1, 1);
      if (RE_TOC_DOTS.test(a) || RE_TOC_DOTS.test(b) || RE_TOC_NUM.test(a)) { para.push(s.replace(/\s{2,}/g, ' ')); continue; }
      closeToc();
    }

    const hasDots = RE_DOTS.test(s);
    const onlyDots = hasDots && !s.replace(RE_DOTS_G, '').replace(/[\s.…]/g, '');
    const mt = s.match(RE_TIT);

    // ---- planilla de datos garantizados
    if (st.inPlan && !hasDots) {
      const nxDots = RE_DOTS.test(nextNonEmpty(i + 1)) || RE_DOTS.test(nextNonEmpty(i + 1, 1));
      if (!(st.groupOpen && nxDots) && !(mt && (s.endsWith(':') || nxDots))) closePlan();
    }
    if (hasDots || (st.inPlan && (mt || st.groupOpen))) {
      closePara(); closeKv();
      st.inPlan = true;
      if (onlyDots) {
        if (!st.hasRow && st.group) { plan.push([st.item, st.group, '']); st.hasRow = true; }
        continue;
      }
      let text = s;
      const numbered = !!mt && !/^\d/.test(mt[2]);
      if (numbered) { st.item = mt![1]; text = mt![2]; st.group = null; st.hasRow = false; }
      if (!hasDots) {
        st.group = st.groupOpen && !numbered ? `${st.group || ''} ${text}`.replace(/[\s:]+$/, '').trim()
                                             : text.replace(/[\s:]+$/, '');
        st.groupOpen = !text.endsWith(':');
        continue;
      }
      st.groupOpen = false;
      const r = planillaFields(text, numbered ? null : st.group);
      if (numbered) st.group = r.group || (r.fields[0]?.[0] ?? null);
      r.fields.forEach(([e, u]) => { plan.push([st.item, e, u]); st.hasRow = true; });
      continue;
    }

    const openPara = para.length > 0 && !/[.:;]$/.test(para[para.length - 1]) && !paraBullet;

    // ---- títulos
    if (mt && (isUpper(mt[2]) || (mt[2].length < 60 && !mt[2].endsWith('.'))) && !kv(s) && indent < 15) {
      closeAll();
      const level = Math.min(2 + (mt[1].match(/\./g) || []).length, 4);
      const t = headingTail(i); i = t.i;
      md.push(`${'#'.repeat(level)} ${mt[1]}. ${esc((mt[2] + t.extra).replace(/\s{2,}/g, ' '))}`, '');
      continue;
    }
    if (isUpper(s) && !kv(s) && s.length < 90 && !s.endsWith('.') && !openPara && !BULLET.test(s)) {
      closeAll();
      const t = headingTail(i); i = t.i;
      md.push(`# ${esc((s + t.extra).replace(/\s{2,}/g, ' '))}`, '');
      continue;
    }

    // ---- parámetro : valor
    const pair = kv(s);
    if (pair) {
      let [label, value] = pair;
      if (label.startsWith('-')) {
        label = label.replace(/^[-\s]+/, '');
        if (para.length === 1 && !para[0].endsWith('.')) st.kvGroup = para.pop()!;
        if (st.kvGroup) label = `${st.kvGroup} – ${label}`;
      } else {
        st.kvGroup = null;
        if (para.length && kvRows.length) { label = `${para.join(' ')} ${label}`; para.length = 0; }
      }
      closePara();
      kvRows.push([label.replace(/\s{2,}/g, ' '), value]);
      continue;
    }

    // ---- viñetas
    if (BULLET.test(s) || (s.search(BULLET_ANY) > 0 && BULLET.test(s.slice(s.search(BULLET_ANY)).trim()))) {
      closeKv();
      const parts = s.split(BULLET_ANY).map(x => x.trim());
      if (parts[0] && !BULLET.test(s)) { if (paraBullet) para.push(parts[0]); else para.push(parts[0]); }
      parts.slice(1).forEach(pt => {
        closePara();
        if (pt) { para.push(pt.replace(/\s{2,}/g, ' ')); paraBullet = 1; paraIndent = indent; }
      });
      continue;
    }
    if (SUB_BULLET.test(s)) {
      closePara(); closeKv();
      para.push(s.replace(SUB_BULLET, '').replace(/\s{2,}/g, ' '));
      paraBullet = 2; paraIndent = indent;
      continue;
    }
    if (paraBullet) {
      if (indent > paraIndent + 5 || /^\p{Ll}/u.test(s)) { para.push(s.replace(/\s{2,}/g, ' ')); continue; }
      closePara();
    }

    // ---- texto corrido
    if (kvRows.length && !para.length) {
      const nk = kv(nextNonEmpty(i + 1));
      if (nk && !nk[0].startsWith('-')) { para.push(s); continue; }
      closeKv();
    } else if (kvRows.length && para.length) {
      para.push(s);
      continue;
    }
    closeKv();
    if (para.length) {
      const last = para[para.length - 1];
      if (/\p{L}-$/u.test(last) && /^\p{Ll}/u.test(s)) { para[para.length - 1] = last.slice(0, -1) + s; continue; }
      if (/[.:;]$/.test(last)) closePara();
    }
    para.push(s.replace(/\s{2,}/g, ' '));
  }
  closeAll();

  return md.join('\n')
    .replace(/mm([²³]) ([/.,])/g, 'mm$1$2')
    .replace(/\bmm2\b/g, 'mm²')
    .replace(/\) \./g, ').')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}
