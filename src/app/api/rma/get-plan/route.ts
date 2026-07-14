import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Lee un plan de contingencia por su ID desde el backend (con Service Role).
 *
 * Esto sustituye a la lectura directa desde el navegador con la clave pública.
 * Permite quitar la política de lectura pública de la tabla contingency_plans:
 * en lugar de exponer toda la tabla al cliente anónimo (que permitiría volcarla
 * entera), el acceso queda limitado a un plan concreto conociendo su UUID exacto.
 */
export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: 'Falta el parámetro planId.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('contingency_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'No se encontró el plan.' }, { status: 404 });
    }

    return NextResponse.json({ plan: data });
  } catch (error: any) {
    console.error('Get Plan Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
