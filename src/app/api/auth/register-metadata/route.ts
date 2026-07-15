import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const {
      email,
      companyName,
      taxId,
      clientFullName,
      clientIdNum,
      clientPhone,
      pendingPrice,
      pendingOption,
      pendingPlanId
    } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. Retrieve users to find matching email (existing user check)
    const { data, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const existingUser = data?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    const metaData = {
      company_name: companyName || '',
      tax_id: taxId || '',
      full_name: clientFullName || '',
      client_id: clientIdNum || '',
      phone: clientPhone || '',
      pending_price_id: pendingPrice || 'payg',
      pending_option: pendingOption || 'single',
      pending_plan_id: pendingPlanId || ''
    };

    if (existingUser) {
      // Update existing user profile metadata
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { user_metadata: metaData }
      );
      if (updateError) throw updateError;
      console.log(`Updated metadata for existing user: ${email}`);
    } else {
      // Pre-create user with metadata
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: false,
        user_metadata: metaData
      });
      if (createError && !createError.message.includes('already exists')) {
        throw createError;
      }
      console.log(`Pre-created user with metadata: ${email}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in register-metadata:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
