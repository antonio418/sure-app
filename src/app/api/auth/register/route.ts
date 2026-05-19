import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Validar que las variables de entorno existan (o usar placeholders temporales)
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key';

const stripe = new Stripe(stripeKey, {
  // @ts-ignore
  apiVersion: '2023-10-16', // versión compatible
});

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, entityType, fullName, companyName, taxId, pvm, country } = body;

    if (!email || !password || !entityType) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // 1. Crear usuario en Supabase Auth
    // Nota: Usamos admin.createUser para poder orquestar la transacción de forma segura
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Podemos ponerlo en false si queremos que verifiquen el correo
      user_metadata: { 
        entity_type: entityType, 
        name: entityType === 'COMPANY' ? companyName : fullName 
      }
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const user = authData.user;

    // 2. Crear Customer en Stripe
    let stripeCustomerId = null;
    try {
      const stripeCustomer = await stripe.customers.create({
        email,
        name: entityType === 'COMPANY' ? companyName : fullName,
        metadata: {
          entityType,
          taxId: taxId || '',
          pvm: pvm || '',
          country: country || '',
          supabase_uuid: user.id
        }
      });
      stripeCustomerId = stripeCustomer.id;
    } catch (stripeErr: any) {
      // Si falla Stripe, podríamos borrar el usuario de Supabase para evitar inconsistencias
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      return NextResponse.json({ error: 'Error al crear cliente de facturación: ' + stripeErr.message }, { status: 400 });
    }

    // 3. Crear el Perfil (Profile) en Supabase
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: user.id,
      entity_type: entityType,
      full_name: fullName || null,
      company_name: companyName || null,
      tax_id: taxId || null,
      pvm: pvm || null,
      country: country || null,
      stripe_customer_id: stripeCustomerId
    });

    if (profileError) {
      // Rollback
      await stripe.customers.del(stripeCustomerId!);
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      return NextResponse.json({ error: 'Error al crear perfil: ' + profileError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });

  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Ocurrió un error inesperado durante el registro' }, { status: 500 });
  }
}
