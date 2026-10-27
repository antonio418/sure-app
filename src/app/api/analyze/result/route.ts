import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Devuelve el informe de un trabajo ya terminado, para recuperarlo si la conexion se corto.
export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get('jobId') || '';
  const email = req.nextUrl.searchParams.get('email') || '';
  if (!UUID.test(jobId)) {
    return NextResponse.json({ error: 'jobId invalido' }, { status: 400 });
  }
  try {
    const { data, error } = await supabaseAdmin
      .from('analysis_results')
      .select('report, email')
      .eq('job_id', jobId)
      .maybeSingle();
    if (error) throw error;
    if (!data || !data.report) return NextResponse.json({ status: 'pending' }, { status: 404 });
    if (data.email && data.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ status: 'pending' }, { status: 404 });
    }
    return NextResponse.json({ report: data.report });
  } catch (e: any) {
    console.error('analysis result lookup error:', e?.message || e);
    return NextResponse.json({ error: 'No se pudo consultar el resultado.' }, { status: 500 });
  }
}
