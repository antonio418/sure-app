import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Publico: dada una huella SHA-256, indica si SURE emitio ese archivo exacto.
// Solo devuelve numero de informe, fecha y tipo; nunca contenido ni datos del cliente.
export async function GET(req: NextRequest) {
  const sha256 = (req.nextUrl.searchParams.get('sha256') || '').toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(sha256)) {
    return NextResponse.json({ error: 'Huella invalida.' }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin
    .from('report_fingerprints')
    .select('report_id, created_at, mode, variant')
    .eq('sha256', sha256)
    .order('created_at', { ascending: true })
    .limit(1);
  if (error) {
    console.error('[ReportVerify] Error:', error);
    return NextResponse.json({ error: 'No se pudo consultar el registro.' }, { status: 500 });
  }
  if (!data || data.length === 0) return NextResponse.json({ found: false });
  const row = data[0];
  return NextResponse.json({
    found: true,
    reportId: row.report_id,
    issuedAt: row.created_at,
    mode: row.mode,
    variant: row.variant,
  });
}
