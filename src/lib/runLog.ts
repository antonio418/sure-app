// Registro tecnico de cada llamada de analisis. Nunca lanza: si Supabase falla, el analisis sigue.
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export interface RunMeta {
  runId?: string | null;
  agent?: string | null;
  mode?: string | null;
  stopReason?: string | null;
  inputTokens?: number | null;
  outputTokens?: number | null;
}

export async function startRun(agent: string, mode: string | null): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('analysis_runs')
      .insert({ agent, mode: mode || null, status: 'started' })
      .select('id')
      .single();
    if (error) {
      console.error('runLog start error:', error.message);
      return null;
    }
    return data?.id || null;
  } catch (e) {
    console.error('runLog start failed:', e);
    return null;
  }
}

export async function endRun(
  runId: string | null | undefined,
  info: { ms: number; ok: boolean; httpStatus?: number; error?: string | null; meta?: RunMeta }
): Promise<void> {
  if (!runId) return;
  try {
    const { error } = await supabaseAdmin
      .from('analysis_runs')
      .update({
        status: info.ok ? 'ok' : 'error',
        duration_ms: Math.round(info.ms),
        stop_reason: info.meta?.stopReason || null,
        input_tokens: info.meta?.inputTokens ?? null,
        output_tokens: info.meta?.outputTokens ?? null,
        error: info.error ? String(info.error).slice(0, 500) : info.httpStatus && !info.ok ? 'HTTP ' + info.httpStatus : null,
        finished_at: new Date().toISOString(),
      })
      .eq('id', runId);
    if (error) console.error('runLog end error:', error.message);
  } catch (e) {
    console.error('runLog end failed:', e);
  }
}
