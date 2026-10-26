import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

// El "sello de emision" demuestra que un numero de informe fue creado por el servidor
// de SURE al completar un analisis real. Se firma con una clave que nunca sale del servidor.
function secret(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('Missing server secret for report seal.');
  return key;
}

export const REPORT_ID_PATTERN = /^SURE-RMA-[A-Z0-9]{6,12}$/;

export function newReportId(): string {
  return `SURE-RMA-${randomBytes(4).toString('hex').toUpperCase()}`;
}

export function signReportId(reportId: string): string {
  return createHmac('sha256', secret()).update('report-issue:' + reportId).digest('hex');
}

export function isValidIssueToken(reportId: string, token: string): boolean {
  try {
    const expected = Buffer.from(signReportId(reportId), 'hex');
    const given = Buffer.from(String(token || ''), 'hex');
    return expected.length === given.length && timingSafeEqual(expected, given);
  } catch {
    return false;
  }
}
