import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Service role client needed to bypass RLS or we can rely on standard policies if read is public.
// Wait, we need to mark it as used. RLS blocks anonymous updates. We need to use Supabase Service Role Key.
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { token, email } = await req.json();

    if (!token || !email) {
      return NextResponse.json({ error: 'Token y correo son obligatorios' }, { status: 400 });
    }

    // 1. Fetch token
    const { data: tokenData, error: fetchError } = await supabaseAdmin
      .from('vip_tokens')
      .select('*')
      .eq('token', token.trim())
      .single();

    if (fetchError || !tokenData) {
      return NextResponse.json({ error: 'Cupón VIP inválido o no existe.' }, { status: 404 });
    }

    // 2. Check if used
    if (tokenData.is_used) {
      return NextResponse.json({ error: 'Este Cupón VIP ya ha sido utilizado o está expirado.' }, { status: 403 });
    }

    // 3. Mark as used (we do this immediately to prevent race conditions)
    // In a real robust system, we would mark it *after* the analysis, but marking it now prevents double-usage
    // Let's mark it as used NOW.
    const { error: updateError } = await supabaseAdmin
      .from('vip_tokens')
      .update({
        is_used: true,
        used_by_email: email,
        used_at: new Date().toISOString()
      })
      .eq('id', tokenData.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, company: tokenData.company_name });

  } catch (error: any) {
    console.error("Token validation error:", error);
    return NextResponse.json({ error: 'Error del servidor al validar cupón' }, { status: 500 });
  }
}
