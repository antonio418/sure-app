import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
  try {
    // We might still receive a body, but we don't depend on agentId anymore
    await req.json().catch(() => {});

    // Call Stripe to create a temporary, secure checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      custom_fields: [
        {
          key: 'company_or_name',
          label: {
            type: 'custom',
            custom: 'Company or Full Name',
          },
          type: 'text',
          optional: true,
        }
      ],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `SURE Network - Full Due Diligence Pipeline`,
              description: 'Sequential AI Analysis (Roberto, Moisés, Alcides) + Executive Consolidator Report.',
              images: ['https://i.ibb.co/6y4jG6X/sure-logo-placeholder.png'], 
            },
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Return to admin with full_pipeline=true
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin?success=true&full_pipeline=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
