import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { domain } = body;

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://sureforensic.com';

    // Call Stripe to create a checkout session for the $70 DNS service
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
      allow_promotion_codes: true, // Crucial for Fernando's viral commission codes
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `SURE DNS Remediation`,
              description: `White-Glove DNS Security Audit & Fix${domain ? ` for ${domain}` : ''}`,
              images: ['https://i.ibb.co/6y4jG6X/sure-logo-placeholder.png'], 
            },
            unit_amount: 7000, // $70.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Return to step 8 to resume the presentation
      success_url: `${origin}/auditoria-dns?step=8&session_id={CHECKOUT_SESSION_ID}&domain=${encodeURIComponent(domain)}`,
      cancel_url: `${origin}/auditoria-dns?step=7`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe DNS Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
