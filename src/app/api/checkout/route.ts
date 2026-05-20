import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { priceId, successUrl, cancelUrl } = body;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const defaultSuccessUrl = `${baseUrl}/intake`;
    const defaultCancelUrl = `${baseUrl}/rma`;

    let sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      success_url: successUrl || defaultSuccessUrl,
      cancel_url: cancelUrl || defaultCancelUrl,
      allow_promotion_codes: true,
    };

    if (priceId) {
      // Dynamic Subscription for Tiers 1-6 & 1x5
      sessionConfig.mode = 'subscription';
      sessionConfig.line_items = [
        {
          price: priceId,
          // quantity is omitted for metered usage (Graduated pricing)
        },
      ];
    } else {
      // Fallback for the $50 Pay-As-You-Go plan
      sessionConfig.mode = 'payment';
      sessionConfig.custom_fields = [
        {
          key: 'company_or_name',
          label: { type: 'custom', custom: 'Company or Full Name' },
          type: 'text',
          optional: true,
        }
      ];
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `SURE Network - Full Due Diligence Pipeline`,
              description: 'Sequential AI Analysis (Roberto, Moisés, Alcides) + Executive Consolidator Report.',
            },
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ];
      sessionConfig.success_url = `${baseUrl}/admin?success=true&full_pipeline=true&session_id={CHECKOUT_SESSION_ID}`;
      sessionConfig.cancel_url = `${baseUrl}/admin?canceled=true`;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
