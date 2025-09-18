import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { sendOrderConfirmationEmail, sendSubscriptionWelcomeEmail } from '@/lib/emails/templates';

const relevantEvents = new Set(['checkout.session.completed', 'invoice.payment_succeeded']);

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = headers().get('stripe-signature');
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn('Webhook Stripe non configuré.');
    return NextResponse.json({ received: true });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (!session.customer_email) break;
        const user = await prisma.user.upsert({
          where: { email: session.customer_email },
          update: {},
          create: {
            email: session.customer_email,
            name: session.customer_details?.name ?? null,
          },
        });
        const order = await prisma.order.create({
          data: {
            userId: user.id,
            stripeSessionId: session.id,
            total: session.amount_total ?? 0,
            currency: session.currency ?? 'eur',
          },
        });
        const productId = session.metadata?.productId;
        const bundleId = session.metadata?.bundleId;
        if (productId) {
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId,
              unitPrice: session.amount_total ?? 0,
            },
          });
          await prisma.entitlement.create({
            data: {
              userId: user.id,
              productId,
              source: 'one_off',
            },
          });
        }
        if (bundleId) {
          await prisma.entitlement.create({
            data: {
              userId: user.id,
              productId: bundleId,
              source: 'bundle',
            },
          });
        }
        await sendOrderConfirmationEmail(session.customer_email);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.customer_email || !invoice.subscription) break;
        const user = await prisma.user.upsert({
          where: { email: invoice.customer_email },
          update: {},
          create: { email: invoice.customer_email },
        });
        await prisma.subscription.upsert({
          where: { stripeSubId: invoice.subscription.toString() },
          update: {
            status: invoice.status ?? 'active',
            currentPeriodEnd: new Date((invoice.lines.data[0]?.period?.end ?? 0) * 1000),
          },
          create: {
            userId: user.id,
            stripeSubId: invoice.subscription.toString(),
            status: invoice.status ?? 'active',
            currentPeriodEnd: new Date((invoice.lines.data[0]?.period?.end ?? 0) * 1000),
          },
        });
        await prisma.entitlement.create({
          data: {
            userId: user.id,
            productId: 'club-monthly-drop',
            source: 'subscription',
          },
        });
        await sendSubscriptionWelcomeEmail(invoice.customer_email);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error('Webhook handling failed', err);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
