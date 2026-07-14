import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      email, 
      companyName, 
      taxId, 
      clientFullName, 
      clientIdNum, 
      clientPhone, 
      selectedPrice, 
      pendingOption,
      pendingPlanId
    } = body;

    if (!email) {
      return NextResponse.json({ error: 'El email es obligatorio.' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sureforensic.com';

    // Determine target redirect path
    let redirectTo = `${origin}/auditoria-rma`;
    if (pendingOption === 'project' && pendingPlanId) {
      redirectTo = `${origin}/rma/plan/${pendingPlanId}`;
    }

    console.log(`Generating magic link for ${email} with redirect to: ${redirectTo}`);

    // Generate Magic Link via Admin API (bypasses sending emails, returns link)
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email.trim(),
      options: {
        redirectTo,
        data: {
          company_name: companyName || '',
          tax_id: taxId || '',
          full_name: clientFullName || '',
          client_id: clientIdNum || '',
          phone: clientPhone || '',
          pending_price_id: selectedPrice || 'payg',
          pending_option: pendingOption || 'single',
          pending_plan_id: pendingPlanId || ''
        }
      }
    });

    if (error) {
      console.error("Error generating link:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      link: data.properties.action_link,
      otp: data.properties.email_otp,
      user: data.user
    });
  } catch (err: any) {
    console.error("Error inside generate-testing-link:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
