import Stripe from 'stripe';
import { bundles, clubSubscription, products } from './seed-data';

const apiVersion: Stripe.LatestApiVersion = '2023-10-16';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion });

type CheckoutInput =
  | { type: 'product'; productId: string; coupon?: string }
  | { type: 'bundle'; bundleId: string; coupon?: string }
  | { type: 'subscription'; priceId?: string; coupon?: string };

export async function createCheckoutSession(input: CheckoutInput) {
  const successUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/library?success=true`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/ebooks?canceled=true`;

  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('Stripe non configuré, renvoi de session factice.');
    return { id: 'cs_test_mock', url: '/account' };
  }

  if (input.type === 'product') {
    const product = products.find((p) => p.id === input.productId);
    if (!product) throw new Error('Produit introuvable');
    return stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      discounts: input.coupon ? [{ coupon: input.coupon }] : undefined,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: product.price,
            product_data: {
              name: product.title,
              description: product.description,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        productId: product.id,
      },
    });
  }

  if (input.type === 'bundle') {
    const bundle = bundles.find((b) => b.id === input.bundleId);
    if (!bundle) throw new Error('Bundle introuvable');
    return stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      discounts: input.coupon ? [{ coupon: input.coupon }] : undefined,
      line_items: bundle.items.map((title) => {
        const product = products.find((p) => p.title === title);
        if (!product) throw new Error('Produit du bundle manquant');
        return {
          price_data: {
            currency: 'eur',
            unit_amount: product.price,
            product_data: {
              name: product.title,
              description: product.description,
            },
          },
          quantity: 1,
        } satisfies Stripe.Checkout.SessionCreateParams.LineItem;
      }),
      metadata: {
        bundleId: bundle.id,
      },
    });
  }

  const priceId = input.priceId ?? process.env.STRIPE_MONTHLY_PRICE_ID;
  if (!priceId) throw new Error('ID de prix abonnement manquant');
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    discounts: input.coupon ? [{ coupon: input.coupon }] : undefined,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      subscriptionPlan: clubSubscription.id,
    },
  });
}

export function findCouponId(code?: string) {
  if (!code) return undefined;
  return code;
}
