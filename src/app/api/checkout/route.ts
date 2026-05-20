import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-01-27.acacia' as any,
});

// Dictionary mapping incoming primary tier price IDs to their Flat upfront and Metered overage components.
const HYBRID_PRICING_MAP: Record<string, { flat: string; overage: string }> = {
  // Tier 1x5
  'price_1TZ5Nu8oubYEwHxxoO7Fz58r': {
    flat: process.env.STRIPE_TIER_1X5_FLAT || 'price_1TZ8z28oubYEwHxx4DnD8gdk',
    overage: process.env.STRIPE_TIER_1X5_OVERAGE || 'price_1TZ90H8oubYEwHxxrilrMdBs'
  },
  'price_1TZ8z28oubYEwHxx4DnD8gdk': {
    flat: process.env.STRIPE_TIER_1X5_FLAT || 'price_1TZ8z28oubYEwHxx4DnD8gdk',
    overage: process.env.STRIPE_TIER_1X5_OVERAGE || 'price_1TZ90H8oubYEwHxxrilrMdBs'
  },

  // Tier 1
  'price_1TZ5tY8oubYEwHxxBdcKo5S1': {
    flat: process.env.STRIPE_TIER_1_FLAT || 'price_1TZ8Ms8oubYEwHxxrCK6grr2',
    overage: process.env.STRIPE_TIER_1_OVERAGE || 'price_1TZ8Ux8oubYEwHxxlTVcBH05'
  },
  'price_1TZ8Ms8oubYEwHxxrCK6grr2': {
    flat: process.env.STRIPE_TIER_1_FLAT || 'price_1TZ8Ms8oubYEwHxxrCK6grr2',
    overage: process.env.STRIPE_TIER_1_OVERAGE || 'price_1TZ8Ux8oubYEwHxxlTVcBH05'
  },

  // Tier 2
  'price_1TZ5zo8oubYEwHxx5yXBkBks': {
    flat: process.env.STRIPE_TIER_2_FLAT || 'price_1TZ8ZO8oubYEwHxxo6I8cAc6',
    overage: process.env.STRIPE_TIER_2_OVERAGE || 'price_1TZ8aj8oubYEwHxxTYbysGz1'
  },
  'price_1TZ8ZO8oubYEwHxxo6I8cAc6': {
    flat: process.env.STRIPE_TIER_2_FLAT || 'price_1TZ8ZO8oubYEwHxxo6I8cAc6',
    overage: process.env.STRIPE_TIER_2_OVERAGE || 'price_1TZ8aj8oubYEwHxxTYbysGz1'
  },

  // Tier 3
  'price_1TZ62e8oubYEwHxxbZe59akn': {
    flat: process.env.STRIPE_TIER_3_FLAT || 'price_1TZ8nD8oubYEwHxxGnaEY9Di',
    overage: process.env.STRIPE_TIER_3_OVERAGE || 'price_1TZ8op8oubYEwHxxwLqhATKG'
  },
  'price_1TZ8nD8oubYEwHxxGnaEY9Di': {
    flat: process.env.STRIPE_TIER_3_FLAT || 'price_1TZ8nD8oubYEwHxxGnaEY9Di',
    overage: process.env.STRIPE_TIER_3_OVERAGE || 'price_1TZ8op8oubYEwHxxwLqhATKG'
  },

  // Tier 4
  'price_1TZ64p8oubYEwHxxKhXRM9E7': {
    flat: process.env.STRIPE_TIER_4_FLAT || 'price_1TZ8qO8oubYEwHxxuOcRIKNG',
    overage: process.env.STRIPE_TIER_4_OVERAGE || 'price_1TZ8rV8oubYEwHxxprUYGssh'
  },
  'price_1TZ8qO8oubYEwHxxuOcRIKNG': {
    flat: process.env.STRIPE_TIER_4_FLAT || 'price_1TZ8qO8oubYEwHxxuOcRIKNG',
    overage: process.env.STRIPE_TIER_4_OVERAGE || 'price_1TZ8rV8oubYEwHxxprUYGssh'
  },

  // Tier 5
  'price_1TZ66p8oubYEwHxxHp0XPQuE': {
    flat: process.env.STRIPE_TIER_5_FLAT || 'price_1TZ8tM8oubYEwHxxQf5uCyk2',
    overage: process.env.STRIPE_TIER_5_OVERAGE || 'price_1TZ8uV8oubYEwHxxqcclFF78'
  },
  'price_1TZ8tM8oubYEwHxxQf5uCyk2': {
    flat: process.env.STRIPE_TIER_5_FLAT || 'price_1TZ8tM8oubYEwHxxQf5uCyk2',
    overage: process.env.STRIPE_TIER_5_OVERAGE || 'price_1TZ8uV8oubYEwHxxqcclFF78'
  },

  // Tier 6
  'price_1TZ68r8oubYEwHxxrwNikdbj': {
    flat: process.env.STRIPE_TIER_6_FLAT || 'price_1TZ8w98oubYEwHxxW9PxHhXW',
    overage: process.env.STRIPE_TIER_6_OVERAGE || 'price_1TZ8xL8oubYEwHxx3fXwoKYT'
  },
  'price_1TZ8w98oubYEwHxxW9PxHhXW': {
    flat: process.env.STRIPE_TIER_6_FLAT || 'price_1TZ8w98oubYEwHxxW9PxHhXW',
    overage: process.env.STRIPE_TIER_6_OVERAGE || 'price_1TZ8xL8oubYEwHxx3fXwoKYT'
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { priceId, successUrl, cancelUrl } = body;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const defaultSuccessUrl = `${baseUrl}/intake`;
    const defaultCancelUrl = `${baseUrl}/rma`;

    let sessionConfig: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      payment_method_types: ['card'],
      success_url: successUrl || defaultSuccessUrl,
      cancel_url: cancelUrl || defaultCancelUrl,
      allow_promotion_codes: true,
    };

    if (priceId) {
      sessionConfig.mode = 'subscription';
      const hybridPrices = HYBRID_PRICING_MAP[priceId];

      if (hybridPrices) {
        // Hybrid billing: Flat upfront price (quantity: 1) + Overage metered price (no quantity)
        sessionConfig.line_items = [
          {
            price: hybridPrices.flat,
            quantity: 1,
          },
          {
            price: hybridPrices.overage,
            // quantity is omitted for metered usage
          }
        ];
      } else {
        // Fallback for single/standard subscription prices (backwards-compatibility)
        sessionConfig.line_items = [
          {
            price: priceId,
          },
        ];
      }
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
