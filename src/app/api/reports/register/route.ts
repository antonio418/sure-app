import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { REPORT_ID_PATTERN, isValidIssueToken } from '@/lib/reportSeal';

const MAX_FINGERPRINTS_PER_REPORT = 25;

// Registra la huella SHA-256 de un PDF emitido. Solo acepta numeros de informe
// que el servidor creo al completar un analisis (sello de emision valido).
export async function POST(req: NextRequest) {
  try {
    const { reportId, issueToken, sha256, mode, variant } = await req.json();

    if (!REPORT_ID_PATTERN.test(String(reportId || '')) || !/^[0-9a-f]{64}$/.test(String(sha256 || ''))) {
      return NextResponse.json({ error: 'Datos invalidos.' }, { status: 400 });
    }
    if (!isValidIssueToken(reportId, issueToken)) {
      return NextResponse.json({ error: 'Sello de emision no valido.' }, { status: 403 });
    }

    const { count } = await supabaseAdmin
      .from('report_fingerprints')
      .select('id', { count: 'exact', head: true })
      .eq('report_id', reportId);
    if ((count || 0) >= MAX_FINGERPRINTS_PER_REPORT) {
      return NextResponse.json({ error: 'Limite de registros alcanzado para este informe.' }, { status: 429 });
    }

    const { error } = await supabaseAdmin.from('report_fingerprints').upsert(
      {
        report_id: reportId,
        sha256,
        mode: mode === 'single' || mode === 'comparative' ? mode : null,
        variant: variant === 'redacted' ? 'redacted' : 'full',
      },
      { onConflict: 'report_id,sha256', ignoreDuplicates: true }
    );
    if (error) {
      console.error('[ReportRegister] Error:', error);
      return NextResponse.json({ error: 'No se pudo registrar la huella.' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[ReportRegister] Error:', e);
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 });
  }
}
