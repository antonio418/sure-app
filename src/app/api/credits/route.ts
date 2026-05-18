import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: 'El parámetro email es obligatorio.' }, { status: 400 });
  }

  try {
    // Usamos supabaseAdmin (Service Role) para baipasear el RLS.
    const { data, error } = await supabaseAdmin
      .from('organization_members')
      .select(`
        organization_id,
        organizations!inner(active_plan, available_credits)
      `)
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Fallback: Si no tiene organización, le mostramos 0.
        return NextResponse.json({ active_plan: 'none', available_credits: 0 });
      }
      throw error;
    }

    const org = data.organizations as any;
    return NextResponse.json({
      active_plan: org?.active_plan || 'none',
      available_credits: org?.available_credits || 0,
      organization_id: data.organization_id
    });
  } catch (err: any) {
    console.error("Error al obtener créditos:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email es obligatorio para descontar créditos.' }, { status: 400 });
    }

    // 1. Verificar balance actual a través de la organización
    const { data, error: fetchError } = await supabaseAdmin
      .from('organization_members')
      .select(`
        organization_id,
        organizations!inner(available_credits)
      `)
      .eq('email', email)
      .single();

    if (fetchError || !data) {
      return NextResponse.json({ error: 'Usuario sin organización asignada.' }, { status: 400 });
    }

    const org = data.organizations as any;
    if (org.available_credits <= 0) {
      return NextResponse.json({ error: 'Créditos corporativos insuficientes.' }, { status: 400 });
    }

    // 2. Descontar 1 crédito del pozo de la organización
    const newBalance = org.available_credits - 1;

    const { data: updatedData, error: updateError } = await supabaseAdmin
      .from('organizations')
      .update({ available_credits: newBalance, updated_at: new Date().toISOString() })
      .eq('id', data.organization_id)
      .select('available_credits')
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, remaining: updatedData.available_credits, organization_id: data.organization_id });
  } catch (err: any) {
    console.error("Error al descontar crédito:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
