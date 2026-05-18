import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-01-27.acacia' as any, // Mantenemos la versión de tu proyecto
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Mapeo táctico de productos a créditos
// Reemplazaremos los IDs en el futuro con tus verdaderos Price IDs de Stripe, 
// pero en Test Mode asignamos valores por cantidad aproximada pagada
const CREDITS_MAPPING: Record<number, { plan: string, credits: number }> = {
  5000: { plan: 'tactico', credits: 1 },    // $50
  10000: { plan: 'operativo', credits: 3 }, // $100
  20000: { plan: 'corporativo', credits: 8 } // $200
};

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      if (!webhookSecret) throw new Error('No STRIPE_WEBHOOK_SECRET found.');
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`⚠️ Webhook Error de validación: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Escuchando pagos exitosos (Single Payments o Primer Pago de Suscripción)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const email = session.customer_details?.email;
      const amountPaid = session.amount_total; // En centavos
      const stripeCustomerId = session.customer as string;

      if (email && amountPaid) {
        // Obtenemos cuántos créditos asignar basados en lo pagado
        const planData = CREDITS_MAPPING[amountPaid];
        // Valor por defecto por seguridad: 1 crédito
        const activePlan = planData?.plan || 'tactico';
        const creditsToAdd = planData?.credits || 1;

        console.log(`✅ Pago detectado: ${email} -> Plan ${activePlan} (+${creditsToAdd} créditos)`);

        // 1. Log the webhook securely
        await supabaseAdmin.from('webhook_logs').insert({
          event_type: event.type,
          status: 'success',
          payload: session
        });

        // 2. Comprobar si el usuario ya pertenece a una organización
        const { data: memberRecord } = await supabaseAdmin
          .from('organization_members')
          .select('organization_id')
          .eq('email', email)
          .single();

        if (memberRecord) {
           // Fetch org current credits
           const { data: org } = await supabaseAdmin
             .from('organizations')
             .select('available_credits')
             .eq('id', memberRecord.organization_id)
             .single();
             
           // Sumar créditos a la organización
           await supabaseAdmin
            .from('organizations')
            .update({
              active_plan: activePlan,
              available_credits: (org?.available_credits || 0) + creditsToAdd,
              updated_at: new Date().toISOString()
            })
            .eq('id', memberRecord.organization_id);
        } else {
           // Insert new organization
           const { data: newOrg } = await supabaseAdmin
            .from('organizations')
            .insert({
              name: `Corporate Workspace - ${email}`,
              active_plan: activePlan,
              available_credits: creditsToAdd
            })
            .select('id')
            .single();

           if (newOrg) {
             // Asignar al comprador como admin
             await supabaseAdmin
              .from('organization_members')
              .insert({
                organization_id: newOrg.id,
                email: email,
                role: 'admin'
              });
           }
        }

        // 3. Affiliate Commission Tracking
        const discountAmount = session.total_details?.amount_discount || 0;
        if (discountAmount > 0) {
          console.log(`🎁 Discount detected: ${discountAmount} cents.`);
          
          // To track exactly WHICH affiliate promo code was used, we normally inspect session.discounts.
          // Since Stripe returns a promotion_code ID, we assume the code matches our DB.
          // For now, we log the transaction in affiliate_commissions pending a link to the affiliate table.
          
          // Fallback or exact logic: if we know Fernando's code was used via metadata or session query
          // Here we just insert a record for auditing so the Admin can pay out the commission.
          await supabaseAdmin.from('affiliate_commissions').insert({
            stripe_session_id: session.id,
            sale_amount: amountPaid / 100, // En dólares
            commission_earned: (amountPaid / 100) * 0.20, // Default 20%
            status: 'pending'
          });
          
          console.log(`💰 Pending commission logged for Session ID: ${session.id}`);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('Error total en webhook:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
