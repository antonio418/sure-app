import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { planId, status, layout_url } = await req.json();

    if (!planId || !status) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos: planId o status.' }, { status: 400 });
    }

    // Obtener los datos existentes
    const { data: plan, error: fetchError } = await supabaseAdmin
      .from('contingency_plans')
      .select('survey_responses')
      .eq('id', planId)
      .single();

    if (fetchError || !plan) {
      return NextResponse.json({ error: 'No se encontró el plan especificado.' }, { status: 404 });
    }

    // Actualizar las respuestas con el nuevo estado y plano
    const updatedResponses = {
      ...plan.survey_responses,
      status: status,
      layout_url: layout_url !== undefined ? layout_url : plan.survey_responses.layout_url || null
    };

    const { error: updateError } = await supabaseAdmin
      .from('contingency_plans')
      .update({
        survey_responses: updatedResponses
      })
      .eq('id', planId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, status });

  } catch (error: any) {
    console.error("Error al actualizar estado del plan:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
